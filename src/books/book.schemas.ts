import { buildJsonSchemas } from "fastify-zod/build/JsonSchema";
import { z } from "zod";

const getBookSchemaRequest = z.object({
  bookId: z.string(),
});

const addBookSchemaRequest = z.object({
  bookName: z.string(),
  authorName: z.string(),
});

const bookSchemaReply = z.object({
  bookId: z.number(),
  bookName: z.string(),
  authorName: z.string(),
});

export const { schemas: bookSchemas, $ref } = buildJsonSchemas(
  {
    bookSchemaReply,
    addBookSchemaRequest,
    getBookSchemaRequest,
  },
  { $id: "bookSchema" }
);

export type Book = z.infer<typeof bookSchemaReply>;
export type BookRequest = z.infer<typeof addBookSchemaRequest>;
