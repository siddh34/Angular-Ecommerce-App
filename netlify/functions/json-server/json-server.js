// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('./netlify/functions/json-server/db.json');
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(router);

// module.exports = server;

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./netlify/functions/json-server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
