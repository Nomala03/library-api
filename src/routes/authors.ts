import express from "express";
import { authors, books, createAuthor } from "../models";
import { validate } from "../middleware/validate";
import { createAuthorSchema, updateAuthorSchema } from "../validators";
import { NotFoundError } from "../middleware/errorHandler";

const router = express.Router();

// Create Author
router.post("/", validate(createAuthorSchema), (req, res) => {
  const payload = req.body as any;
  const author = createAuthor(payload); 
  authors.push(author);
  res.status(201).json(author);
});

// List All Authors
router.get("/", (_req, res) => {
  res.json(authors);
});

// Get Author By ID
router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id); // convert to number
  const a = authors.find((a) => a.id === id);
  if (!a) return next(new NotFoundError("Author not found"));
  res.json(a);
});

// Update Author
router.put("/:id", validate(updateAuthorSchema), (req, res, next) => {
  const id = Number(req.params.id);
  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) return next(new NotFoundError("Author not found"));
  authors[index] = { ...authors[index], ...req.body };
  res.json(authors[index]);
});

// Delete Author (also remove their books)
router.delete("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) return next(new NotFoundError("Author not found"));
  const deleted = authors.splice(index, 1)[0];

  // remove their books
  for (let i = books.length - 1; i >= 0; i--) {
    if (books[i].authorId === deleted.id) books.splice(i, 1);
  }

  res.json({ deleted });
});

// List Books By an Author
router.get("/:id/books", (req, res, next) => {
  const id = Number(req.params.id);
  const author = authors.find((a) => a.id === id);
  if (!author) return next(new NotFoundError("Author not found"));
  const list = books.filter((b) => b.authorId === id);
  res.json(list);
});

export default router;

