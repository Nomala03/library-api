export interface Author {
  id: number;
  name: string;
  bio?: string;
  birthDate?: string;
}

export interface Book {
  id: number;
  title: string;
  authorId: number;
  publishedAt?: string; 
  pages?: number;
  summary?: string;
  year?: number; 
}


// In-memory stores
 
export const authors: Author[] = [
  { id: 1, name: "Maya Angelou" },
  { id: 2, name: "F. Scott Fitzgerald" },
];
export const books: Book[] = [
   {
    id: 1,
    title: "I know Why The Caged Bird Sings",
    year: 1969,
    authorId: authors[0].id,
  },
  {
    id: 2,
    title: "The Great Gatsby",
    year: 1925,
    authorId: authors[1].id,
  },
];

// Track next IDs
let nextAuthorId = authors.length + 1;
let nextBookId = books.length + 1;

export function createAuthor(data: Omit<Author, "id">): Author {
  const author: Author = { id: nextAuthorId++, ...data };
  return author;
}

export function createBook(data: Omit<Book, "id">): Book {
  const book: Book = { id: nextBookId++, ...data };
  return book;
}
 