import { z } from "zod";

// Create Author
export const createAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// Update Author
export const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
});

// Create Book
export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorId: z.number().int().positive(),
});

// Update Book
export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  authorId: z.number().int().positive().optional(),
});
