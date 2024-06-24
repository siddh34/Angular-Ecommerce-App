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
    statusCode: response.statusCode,
    headers: response.headers,
    body: response.body,
  };
};
