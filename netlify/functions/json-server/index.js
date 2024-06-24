// const server = require('./json-server');

// exports.handler = async (event, context) => {
//   const response = await new Promise((resolve, reject) => {
//     server(event, context, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });

//   return {
//     statusCode: response.statusCode,
//     headers: response.headers,
//     body: response.body,
//   };
// };


const server = require('./json-server');

exports.handler = async (event, context) => {
  const response = await new Promise((resolve, reject) => {
    server(event, context, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

  return {
    statusCode: response.statusCode || 200,
    headers: response.headers || { 'Content-Type': 'application/json' },
    body: response.body || '',
  };
};

module.exports = jsonServer.router();