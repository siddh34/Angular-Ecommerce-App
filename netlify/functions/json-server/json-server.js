import data from "./db.json"

const handler = async (event, context) => {
  try {
    if (event.path.includes("/api/users")) {
      if (event.httpMethod === "POST") {

        const user = JSON.parse(event.body);

        console.log("user", user);

        if (!user.email || !user.name || !user.password || !user.phoneNumber) {
          return {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "Missing required user fields" }),
          };
        }

        const existingUser = data.users.find((u) => u.email === user.email);

        if (existingUser) {
          return {
            statusCode: 409,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "User already exists" }),
          };
        }

        user.id = Math.random().toString(36).substring(2, 15); // Generate a new ID for the user
        data.users.push(user);

        return {
          statusCode: 201,
          body: JSON.stringify(user),
        };
      } else if (event.httpMethod === "GET") {
        const { email } = event.queryStringParameters;

        if (!email) {
          return {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
              error: "Email query parameter is required",
            }),
          };
        }

        const user = data.users.find((u) => u.email === email);

        if (!user) {
          return {
            statusCode: 404,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: null,
          };
        }

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify([user]),
        };
      } else {
        return {
          statusCode: 405,
          headers: { Allow: "GET, POST" },
          body: JSON.stringify({ error: "Method Not Allowed" }),
        };
      }
    } else if (event.path.includes('/api/products')) {
      const productIdMatch = event.path.match(/\/api\/products\/(\d+)/);

      if (event.httpMethod === 'GET' && !productIdMatch) {
        // Handle GET /products
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify(data.products),
        };
      } else if (event.httpMethod === 'GET' && productIdMatch) {
        // Handle GET /products/:id
        const productId = productIdMatch[1];
        const product = data.products.find(p => p.id === productId);

        if (!product) {
          return {
            statusCode: 404,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "Product not found" }),
          };
        }

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify(product),
        };
      }
      else {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Not Found" }),
        };
      }
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

module.exports.handler = handler;