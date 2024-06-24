const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./netlify/functions/json-server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const handler = async (event, context) => {
  const response = await new Promise((resolve, reject) => {
    server.handle(event, context, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
  return response;
};

// Export the handler function directly
module.exports.handler = handler;