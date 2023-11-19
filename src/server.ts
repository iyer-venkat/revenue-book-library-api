import dotenv from "dotenv";
import Fastify from "fastify";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { swaggerOptions, swaggerUiOptions } from "./swaggerOptions";
import { authenticateUser } from "../middleware/auth";
import { bookSchemas, loginSchemas } from "./allSchemas";
import { bookRoutes, loginRoutes } from "./allRoutes";
import { initialiseDB, initialiseData } from "./books/book.service";
import books from "./data/books.json";

dotenv.config();
const server = Fastify({ logger: false });

const main = async () => {
  try {
    for (const schema of [...loginSchemas, ...bookSchemas])
      server.addSchema(schema);

    //Register swagger Route
    server.register(fastifySwagger, swaggerOptions);
    server.register(fastifySwaggerUi, swaggerUiOptions);

    server.register(cookie, {
      secret: "my-secret", // for cookies signature
      parseOptions: {}, // options for parsing cookies
    } as FastifyCookieOptions);

    server.addHook("preHandler", (req, res, done) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:5173");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
      );
      res.header("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );

      if (req.method === "OPTIONS") return res.send();

      done();
    });

    // Register app Routes
    server.register(loginRoutes, {
      prefix: "api/login",
      tags: ["login"],
    });

    server.register(bookRoutes, {
      prefix: "api",
      preHandler: authenticateUser,
      tags: ["books"],
    });

    initialiseDB();
    initialiseData();

    await server.listen({ port: 4000, host: "0.0.0.0" });
    console.log(`Server ready at http://localhost:4000`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
