# JanusGraph-Visualizer

### TLDR:
0. `npm install`
1. `npm run build`
2. create a `.env` file in app directory set `USERNAME`, `PASSWORD`, `PROTOCOL`
3. `npm start`
4. http://localhost:3001

This project is to visualize the graph network corresponding to a gremlin query.

![alt text](https://raw.githubusercontent.com/JanusGraph/janusgraph-visualizer/refs/heads/main/assets/JanusGraph-Visualizer.png)

### Quick start guide

Below is a quick start guide to start JanusGraph, load the testing graph, and start visualization to show the graph.  
Notice, this guide uses Docker image, but it's possible to start JanusGraph and visualization tool without (see `Setting Up JanusGraph Visualizer` section below).

1. Start JanusGraph on your host machine: `docker run --name janusgraph-default -p 8182:8182 --network=host janusgraph/janusgraph:latest`
2. Open second terminal and start gremlin console: `docker run --rm --network=host -e GREMLIN_REMOTE_HOSTS=localhost -it janusgraph/janusgraph:latest ./bin/gremlin.sh`
3. Connect to JanusGraph Server from your running Gremlin Console: `:remote connect tinkerpop.server conf/remote.yaml`
4. Instruct Gremlin Console to send all requests to the connected remote server: `:remote console`
5. Load JanusGraph testing graph via Gremlin Console: `GraphOfTheGodsFactory.load(graph)`
6. Exit Gremlin Console because it's no longer needed: `:exit`
7. Start JanusGraph-Visualizer: `docker run --rm -d -p 3000:3000 -p 3001:3001 --name=janusgraph-visualizer --network=host janusgraph/janusgraph-visualizer:latest`
8. Open your browser and enter address `http://localhost:3001/`
9. Click `EXECUTE` button. You should see the same graph as the one specified on the image above.

### Setting Up JanusGraph Visualizer
To setup JanusGraph visualizer, you need to have `node.js` and `npm` installed in your system.

* Clone the project
```sh
git clone https://github.com/JanusGraph/janusgraph-visualizer.git
```
* Install dependencies
```sh
npm install
```
* Run the project
```sh
npm start
```
* Open the browser and navigate to
```sh
http://localhost:3000
```

Note - Frontend starts on port 3000 and simple Node.js server also starts on port 3001. If you need to change the ports, configure in `package.json`, `proxy-server.js`, `src/constants` 

#### Setting up with Docker

You can build a Docker image of the JanusGraph visualizer with the included `Dockerfile`.
This will use the current version of the `main` branch of the source GitHub repository.
The Docker image can be built by calling the `docker build -f full.Dockerfile` command, for example:

```sh
docker build --tag=janusgraph-visualizer:latest -f full.Dockerfile .
```

If you had already built node project on your host then you can create a Docker image faster by using `Dockerfile` instead of `full.Dockerfile`: 

```sh
docker build --tag=janusgraph-visualizer:latest .
```

The image can also be downloaded from Docker hub: [`janusgraph/janusgraph-visualizer:latest`](https://hub.docker.com/r/janusgraph/janusgraph-visualizer).

```sh
docker pull janusgraph/janusgraph-visualizer:latest
```

The Docker image can then be run by calling `docker run` and exposing the necessary ports for communication. See [Docker's documentation](https://docs.docker.com/engine/reference/commandline/run/) for more options on how to run the image.

```sh
# if you built the image yourself
docker run --rm -d -p 3000:3000 -p 3001:3001 --name=janusgraph-visualizer --network=host janusgraph-visualizer:latest
# if you downloaded from Docker Hub
docker run --rm -d -p 3000:3000 -p 3001:3001 --name=janusgraph-visualizer --network=host janusgraph/janusgraph-visualizer:latest
```
Note that `--network=host` is not needed if you don't run your gremlin server in the host machine. 

* Open the browser and navigate to
```sh
http://localhost:3001
```

The Docker container can be stopped by calling `docker stop janusgraph-visualizer`.

### Supported Environment Variables

* `GREMLIN_HOST` - sets gremlin server hostname for connection. Default is `localhost`.
* `GREMLIN_PORT` - sets gremlin server port for connection. Default is `8182`.
* `GREMLIN_TRAVERSAL_SOURCE` - sets default graph traversal source name to be used for queries. Default is `g`.
* `GREMLIN_DEFAULT_QUERY` - sets default query to show in visualizer. Default is `g.V()`.

### Usage
* Start JanusGraph-Visualizer as mentioned above
* Start or tunnel a gremlin server
* Specify the host and port of the gremlin server
* Write a gremlin query to retrieve a set of nodes (eg. `g.V()`)

### Features
* If you don't clear the graph and execute another gremlin query, results of previous query and new query will be merged and be shown.
* Node and edge properties are shown once you click on a node/edge
* Change the labels of nodes to any property
* View the set of queries executed to generate the graph
* Traverse in/out from the selected node

## Credits
JanusGraph-Visualizer is based on the original Gremlin-Visualizer that can be found [here](https://github.com/prabushitha/gremlin-visualizer).   
Author of the original Gremlin-Visualizer is: [Umesh Jayasinghe](https://github.com/prabushitha).

### What is the different in this fork comparing to the origin repo
1. Added suppport for different graph names
2. Added GitHub actions to build & push Docker image
3. Added productions mode to host in Kubernetes
4. Added ability to override default values (graph host, port, name) via environment variables

## Something Missing?

If you have new ideas to improve please create an issue and make a pull request
