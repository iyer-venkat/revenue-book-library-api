import { SwaggerOptions } from "@fastify/swagger";
import { FastifyRegisterOptions } from "fastify";

export const swaggerOptions: FastifyRegisterOptions<SwaggerOptions> = {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "fastify-apis",
      description: "API implementation using Fastify.",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:4000" }],
    tags: [
      { name: "books", description: "API implementation for books" },
      { name: "login", description: "API implementation for login" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};

export const swaggerUiOptions = {
  openapi: "3.0.3",
  routePrefix: "/docs",
  exposeRoute: true,
};
