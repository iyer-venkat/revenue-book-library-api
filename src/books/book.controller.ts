import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { Book, BookRequest } from "./book.schemas";
import {
  addBook as addBookService,
  getAllBooks as getAllBooksService,
  getBookById as getBookByIdService,
  borrowBook as borrowBookService,
  deleteBook as deleteBookService,
  returnBook as returnBookService,
} from "./book.service";

export const getAllBooks = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const books = getAllBooksService();
  reply.send(books);
};

export const getBookById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const book = getBookByIdService(+id);
  reply.send(book);
};

export const addBook = async (request: FastifyRequest, reply: FastifyReply) => {
  const { bookName, authorName } = request.body as BookRequest;
  const bookId = addBookService(bookName, authorName);

  reply.send({ bookId, bookName, authorName } as Book);
};

export const transactBook = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { available } = request.body as { available: number };
  const success = available ? borrowBookService(+id) : returnBookService(+id);

  reply.send({ success });
};

export const deleteBook = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const success = deleteBookService(+id);

  reply.send({ success });
};
