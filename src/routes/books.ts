import express, { Request, Response, NextFunction } from "express";
import { books, authors, createBook, Book } from "../models";
import { validate } from "../middleware/validate";
import { createBookSchema, updateBookSchema } from "../validators";
import { NotFoundError, BadRequestError, ConflictError } from "../middleware/errorHandler";

const router = express.Router();

// Helper: normalize a book's year (if publishedAt provided)
function extractYear(book: Partial<Book>): number | undefined {
  if (book.publishedAt) {
    const y = new Date(book.publishedAt).getFullYear();
    if (!Number.isNaN(y) && isFinite(y)) return y;
  }
  return book.year ?? undefined;
}

// CREATE BOOK
router.post("/", validate(createBookSchema), (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as Omit<Book, "id">;

    // ensure author exists
    const author = authors.find((a) => a.id === payload.authorId);
    if (!author) return next(new BadRequestError("authorId does not reference an existing author"));

    // conflict: duplicate title for same author
    const exists = books.some(
      (b) => b.authorId === payload.authorId && b.title.toLowerCase() === payload.title.toLowerCase()
    );
    if (exists) return next(new ConflictError("A book with the same title already exists for this author"));

    const book = createBook({ ...payload, year: extractYear(payload) });
    books.push(book);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// LIST ALL BOOKS 
router.get("/", (req: Request, res: Response) => {
  let results = [...books];

  const { title, author: authorQ, year, page, limit, sort, order } = req.query;

  if (title && typeof title === "string") {
    const q = title.toLowerCase();
    results = results.filter((b) => b.title.toLowerCase().includes(q));
  }

  if (authorQ && typeof authorQ === "string") {
    const q = authorQ.toLowerCase();
    const authorIdNum = parseInt(authorQ, 10);

    results = results.filter((b) => {
      if (!Number.isNaN(authorIdNum) && b.authorId === authorIdNum) return true;
      const a = authors.find((x) => x.id === b.authorId);
      if (!a) return false;
      return a.name.toLowerCase().includes(q);
    });
  }

  if (year) {
    const yNum = parseInt(String(year), 10);
    if (!Number.isNaN(yNum)) {
      results = results.filter((b) => (b.year ?? undefined) === yNum);
    }
  }

  // sorting
  if (sort && typeof sort === "string") {
    const key = sort as keyof Book;
    const dir = order === "desc" ? -1 : 1;
    results.sort((a, b) => {
      const va = a[key] ?? "";
      const vb = b[key] ?? "";
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  // pagination
  let pageNum = 1;
  let limitNum = 50;
  if (page) {
    const p = parseInt(String(page), 10);
    if (!Number.isNaN(p) && p > 0) pageNum = p;
  }
  if (limit) {
    const l = parseInt(String(limit), 10);
    if (!Number.isNaN(l) && l > 0) limitNum = l;
  }

  const start = (pageNum - 1) * limitNum;
  const paged = results.slice(start, start + limitNum);

  res.json({
    total: results.length,
    page: pageNum,
    limit: limitNum,
    items: paged,
  });
});

// GET BOOK BY ID 
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);
  if (!book) return next(new NotFoundError("Book not found"));
  res.json(book);
});

// UPDATE BOOK
router.put("/:id", validate(updateBookSchema), (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return next(new NotFoundError("Book not found"));

  const payload = req.body as Partial<Book>;

  // if authorId is provided, ensure it exists
  if (payload.authorId) {
    const a = authors.find((x) => x.id === payload.authorId);
    if (!a) return next(new BadRequestError("authorId does not reference an existing author"));
  }

  // conflict if updating title+author to match another book (exclude self)
  if (payload.title || payload.authorId) {
    const newTitle = (payload.title ?? books[idx].title).toLowerCase();
    const newAuthorId = payload.authorId ?? books[idx].authorId;
    const conflict = books.some(
      (b) => b.id !== books[idx].id && b.authorId === newAuthorId && b.title.toLowerCase() === newTitle
    );
    if (conflict) return next(new ConflictError("Another book with same title exists for this author"));
  }

  const updated: Book = { ...books[idx], ...payload, year: extractYear({ ...books[idx], ...payload }) };
  books[idx] = updated;
  res.json(updated);
});

// DELETE BOOK
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return next(new NotFoundError("Book not found"));
  const deleted = books.splice(idx, 1)[0];
  res.json({ deleted });
});

export default router;
