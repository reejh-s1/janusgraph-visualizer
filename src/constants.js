// Do not place other env vars here. Use settings endpoint in proxy-server.js to get them.
// process.env is this file is evaluated at build time.
// https://stackoverflow.com/a/46367006/6619628
const SERVER_URL = process.env.NODE_ENV == 'production' ? '' : 'http://localhost:3001';
export const QUERY_ENDPOINT = `${SERVER_URL}/query`;
export const SETTINGS_ENDPOINT = `${SERVER_URL}/settings`;
export const COMMON_GREMLIN_ERROR = 'Invalid query. Please execute a query to get a set of vertices';

export const ACTIONS = {
  SET_INITIALIZING: 'SET_INITIALIZING',
  SET_LOADING: 'SET_LOADING',
  SET_HOST: 'SET_HOST',
  SET_PORT: 'SET_PORT',
  SET_QUERY: 'SET_QUERY',
  SET_TRAVERSAL_SOURCE: 'TRAVERSAL_SOURCE',
  SET_ERROR: 'SET_ERROR',
  SET_NETWORK: 'SET_NETWORK',
  CLEAR_GRAPH: 'CLEAR_GRAPH',
  ADD_NODES: 'ADD_NODES',
  ADD_EDGES: 'ADD_EDGES',
  SET_SELECTED_NODE: 'SET_SELECTED_NODE',
  SET_SELECTED_EDGE: 'SET_SELECTED_EDGE',
  SET_IS_PHYSICS_ENABLED: 'SET_IS_PHYSICS_ENABLED',
  ADD_QUERY_HISTORY: 'ADD_QUERY_HISTORY',
  CLEAR_QUERY_HISTORY: 'CLEAR_QUERY_HISTORY',
  SET_NODE_LABELS: 'SET_NODE_LABELS',
  ADD_NODE_LABEL: 'ADD_NODE_LABEL',
  EDIT_NODE_LABEL: 'EDIT_NODE_LABEL',
  REMOVE_NODE_LABEL: 'REMOVE_NODE_LABEL',
  REFRESH_NODE_LABELS: 'REFRESH_NODE_LABELS',
  SET_NODE_LIMIT: 'SET_NODE_LIMIT'
};