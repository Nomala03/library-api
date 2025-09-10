import { z } from "zod";

export const createAuthorSchema = z.object({
  name: z.string().min(1, "name is required"),
  bio: z.string().optional(),
  birthDate: z.string().optional(), // allow loose date formats; further checks can be added
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const createBookSchema = z.object({
  title: z.string().min(1, "title is required"),
  authorId: z.string().min(1, "authorId is required"),
  publishedAt: z.string().optional(),
  pages: z.number().int().positive().optional(),
  summary: z.string().optional(),
});

export const updateBookSchema = createBookSchema.partial();
