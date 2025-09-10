import { nanoid } from "nanoid";

export type ID = string;

export interface Author {
  id: ID;
  name: string;
  bio?: string;
  birthDate?: string;
}

export interface Book {
  id: ID;
  title: string;
  authorId: ID;
  publishedAt?: string; 
  pages?: number;
  summary?: string;
  year?: number; // convenience (extracted from publishedAt if present)
}


// In-memory stores
 
export const authors: Author[] = [];
export const books: Book[] = [];

export function createAuthor(data: Omit<Author, "id">): Author {
  return { id: nanoid(), ...data };
}
export function createBook(data: Omit<Book, "id">): Book {
  return { id: nanoid(), ...data };
}
