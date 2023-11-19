import sqlite3 from "better-sqlite3";
import books from "../data/books.json";
import { Book } from "./book.schemas";

let db = new sqlite3(":memory:", { fileMustExist: false });
db.pragma("journal_mode = WAL");

export const initialiseDB = () => {
  db.prepare(
    "CREATE TABLE Books (bookName TEXT, authorName TEXT, available BOOLEAN NOT NULL DEFAULT 1 CHECK (Available IN (0, 1)))"
  ).run();
};

export const initialiseData = () => {
  let insertStmt = "INSERT INTO Books(bookName, authorName) VALUES ";
  books.forEach((book) => {
    insertStmt += `('${book.bookName.replaceAll("'", "''")}', '${
      book.authorName
    }'),`;
  });

  db.prepare(insertStmt.substring(0, insertStmt.length - 1)).run();
};

export const addBook = (
  bookName: string,
  authorName: string
): number | bigint => {
  const stmt = "INSERT INTO Books(bookName, authorName) VALUES (?,?)";
  const params = [bookName, authorName];
  const { lastInsertRowid: bookId } = db.prepare(stmt).run(params);

  return bookId;
};

export const getAllBooks = (): Book[] =>
  db.prepare("SELECT rowid as bookId, * FROM Books").all() as Book[];

export const getBookById = (bookId: number | bigint): Book =>
  db
    .prepare("SELECT rowid as bookId, * FROM Books WHERE rowid=?")
    .get([bookId]) as Book;

export const borrowBook = (bookId: number | bigint): boolean => {
  const result = db
    .prepare("UPDATE Books SET available=0 WHERE rowid = ?")
    .run([bookId]);

  return result.changes > 0;
};

export const returnBook = (bookId: number | bigint): boolean => {
  const result = db
    .prepare("UPDATE Books SET available=1 WHERE rowid = ?")
    .run([bookId]);

  return result.changes > 0;
};

export const deleteBook = (bookId: number | bigint): boolean => {
  const result = db
    .prepare("DELETE FROM Books WHERE rowid = ? and available=1")
    .run([bookId]);

  return result.changes > 0;
};

export const closeConnection = () => {
  db.close();
};
