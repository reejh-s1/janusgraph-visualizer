import React from 'react';
import { connect } from 'react-redux';
import { Button, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText }  from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR, SETTINGS_ENDPOINT } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';

let cancelTokenSource;

class Header extends React.Component {
  clearGraph() {
    this.props.dispatch({ type: ACTIONS.CLEAR_GRAPH });
    this.props.dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  }

  sendQuery() {
    this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    this.props.dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    cancelTokenSource = axios.CancelToken.source();

    axios.post(
      QUERY_ENDPOINT,
      { host: this.props.host, port: this.props.port, query: this.props.query, nodeLimit: this.props.nodeLimit, traversalSource: this.props.traversalSource },
      { headers: { 'Content-Type': 'application/json' }, cancelToken: cancelTokenSource.token }
    ).then((response) => {
      onFetchQuery(response, this.props.query, this.props.nodeLabels, this.props.dispatch);
    }).catch((error) => {
      this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
    }).finally(() => {
      this.props.dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    });
  }

  cancel() {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
      cancelTokenSource = null;
    }
  }

  onHostChanged(host) {
    this.props.dispatch({ type: ACTIONS.SET_HOST, payload: host });
  }

  onPortChanged(port) {
    this.props.dispatch({ type: ACTIONS.SET_PORT, payload: port });
  }

  onTraversalSourceChange(traversalSource) {
    this.props.dispatch({ type: ACTIONS.SET_TRAVERSAL_SOURCE, payload: traversalSource });
  }

  onQueryChanged(query) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY, payload: query });
  }

  componentDidMount() {
    axios.get(SETTINGS_ENDPOINT).then((response) => {
      this.props.dispatch({ type: ACTIONS.SET_HOST, payload: response.data.GREMLIN_HOST });
      this.props.dispatch({ type: ACTIONS.SET_PORT, payload: response.data.GREMLIN_PORT });
      this.props.dispatch({ type: ACTIONS.SET_TRAVERSAL_SOURCE, payload: response.data.GREMLIN_TRAVERSAL_SOURCE });
      this.props.dispatch({ type: ACTIONS.SET_QUERY, payload: response.data.GREMLIN_DEFAULT_QUERY });
      this.props.dispatch({ type: ACTIONS.SET_INITIALIZING, payload: false });
    });
  }

  render(){
    return (
      <div className={'header'}>
        <form noValidate autoComplete="off">
          <TextField value={this.props.host} onChange={(event => this.onHostChanged(event.target.value))} id="standard-basic" label="host" style={{width: '10%'}} />
          <TextField value={this.props.port} onChange={(event => this.onPortChanged(event.target.value))} id="standard-basic" label="port" style={{width: '10%'}} />
          <TextField value={this.props.traversalSource} onChange={(event => this.onTraversalSourceChange(event.target.value))} id="standard-basic" label="Gremlin Traversal Source" style={{width: '20%'}} />
          <TextField value={this.props.query} onChange={(event => this.onQueryChanged(event.target.value))} id="standard-basic" label="gremlin query" style={{width: '60%'}} />
          <Button variant="contained" disabled={this.props.loading} color="primary" onClick={this.sendQuery.bind(this)} style={{width: '150px'}} >Execute</Button>
          <Button variant="outlined" color="secondary" onClick={this.clearGraph.bind(this)} style={{width: '150px'}} >Clear Graph</Button>
          {this.props.loading && 
            <>
              <LinearProgress /> 
              <Button variant="contained" color="warn" onClick={this.cancel.bind(this)} style={{width: '150px'}} >Cancel</Button>
            </>
          }
          {this.props.initializing && 
            <Dialog
              open={true}
            >
              <DialogTitle>
                {"Initializing..."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Getting initial values from API...
                </DialogContentText>
              </DialogContent>
            </Dialog>
          }
        </form>

        <br />
        <div style={{color: 'red'}}>{this.props.error}</div>
      </div>

    );
  }
}

export const HeaderComponent = connect((state)=>{
  return {
    loading: state.gremlin.loading,
    host: state.gremlin.host,
    port: state.gremlin.port,
    traversalSource: state.gremlin.traversalSource,
    query: state.gremlin.query,
    error: state.gremlin.error,
    nodes: state.graph.nodes,
    edges: state.graph.edges,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit,
    initializing: state.gremlin.initializing
  };
})(Header);