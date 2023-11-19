import { FastifyInstance } from "fastify";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  transactBook,
} from "./book.controller";
import { $ref } from "./book.schemas";

export const bookRoutes = (
  server: FastifyInstance,
  options: any,
  done: any
) => {
  const { preHandler, tags } = options;
  // server.addHook("preHandler", preHandler);

  server.get("/books", { schema: { tags } }, getAllBooks);

  server.get(
    "/books/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the book identifier, as bookId",
            },
          },
        },
        response: {
          200: $ref("bookSchemaReply") /*{
            type: "object",
            properties: {
              itemId: {
                type: "string",
                description: "the item identifier, as itemId",
              },
              itemName: {
                type: "string",
                description: "the item name",
              },
            },
          }*/,
        },
        tags,
      },
    },
    getBookById
  );

  server.put(
    "/books/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the book identifier, as bookId",
            },
          },
        },
        body: {
          type: "object",
          properties: {
            available: {
              type: "number",
              description: "0 is for Return; 1 is for Borrow",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description:
                  "returns true if the book was successfully borrowed",
              },
            },
          },
        },
        tags,
      },
    },
    transactBook
  );

  server.delete(
    "/books/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the book identifier, as bookId",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description:
                  "returns true if the book was successfully deleted",
              },
            },
          },
        },
        tags,
      },
    },
    deleteBook
  );

  server.post(
    "/book",
    {
      schema: {
        body: $ref("addBookSchemaRequest"),
        response: {
          200: $ref("bookSchemaReply"),
        },
        tags,
      },
    },
    addBook
  );

  done();
};
