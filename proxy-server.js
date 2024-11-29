require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

const username = process.env.USERNAME || "";
const password = process.env.PASSWORD || "";
const protocol = process.env.PROTOCOL || "";

app.use(cors({
    credentials: true,
}));

// parse application/json
app.use(bodyParser.json());

function mapToObj(inputMap) {
    let obj = {};

    inputMap.forEach((value, key) => {
        obj[key] = value
    });

    return obj;
}

function edgesToJson(edgeList) {
    return edgeList.map(
        edge => ({
            id: typeof edge.get('id') !== "string" ? JSON.stringify(edge.get('id')) : edge.get('id'),
            from: edge.get('from'),
            to: edge.get('to'),
            label: edge.get('label'),
            properties: mapToObj(edge.get('properties')),
        })
    );
}

function nodesToJson(nodeList) {
    return nodeList.map(
        node => ({
            id: node.get('id'),
            label: node.get('label'),
            properties: mapToObj(node.get('properties')),
            edges: edgesToJson(node.get('edges'))
        })
    );
}

function makeQuery(query, nodeLimit) {
    const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})` : '';
    return `${query}${nodeLimitQuery}
  .dedup()
  .as('node')
  .project('id', 'label', 'properties', 'edges')
  .by(__.id())
  .by(__.label())
  .by(__.valueMap())
  .by(__.outE()
        .project('id', 'from', 'to', 'label', 'properties')
        .by(__.id())
        .by(__.select('node').id())
        .by(__.inV().id())
        .by(__.label())
        .by(__.valueMap())
        .fold()
  )`;
}

app.post('/query', (req, res, next) => {
    const gremlinHost = req.body.host;
    const gremlinPort = req.body.port;
    const nodeLimit = req.body.nodeLimit;
    const query = req.body.query;
    const traversalSource = req.body.traversalSource;


    let defaultOptions = {
        traversalSource: traversalSource, mimeType: 'application/json',
        rejectUnauthorized: false
    }

    if (username.length && password.length) {
        defaultOptions.authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(username, password);
    }

    let defaultConnectionString = `ws://${gremlinHost}:${gremlinPort}/gremlin`;
    if (protocol.length) {
        defaultConnectionString = `${protocol}://${gremlinHost}:${gremlinPort}/gremlin`
    }

    const client = new gremlin.driver.Client(defaultConnectionString, defaultOptions);

    client.submit(makeQuery(query, nodeLimit), {})
        .then((result) => res.send(nodesToJson(result._items)))
        .catch((err) => next(err));

});

app.get('/settings', (_, res) => {
    return res.json({
        GREMLIN_HOST: firstNotNull(process.env.GREMLIN_HOST, 'localhost'),
        GREMLIN_PORT: firstNotNull(process.env.GREMLIN_PORT, '8182'),
        GREMLIN_TRAVERSAL_SOURCE: firstNotNull(process.env.GREMLIN_TRAVERSAL_SOURCE, 'g'),
        GREMLIN_DEFAULT_QUERY: firstNotNull(process.env.GREMLIN_DEFAULT_QUERY, 'g.V()'),
    });
});

// Hosting react app in express 
// https://create-react-app.dev/docs/deployment#other-solutions
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));

function firstNotNull() {
    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i];
        if (arg) {
            return arg;
        }
    }
}