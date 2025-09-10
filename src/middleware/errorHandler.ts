import { Response } from "express";
import { ZodError } from "zod";

/**
 * Custom error shapes used by routes
 */
export class NotFoundError extends Error {
  status = 404;
  constructor(message = "Not Found") { super(message); this.name = "NotFoundError"; }
}
export class BadRequestError extends Error {
  status = 400;
  constructor(message = "Bad Request") { super(message); this.name = "BadRequestError"; }
}
export class ConflictError extends Error {
  status = 409;
  constructor(message = "Conflict") { super(message); this.name = "ConflictError"; }
}

/**
 * Centralized handler function used in index.ts
 */
export function errorHandler(err: any, res: Response) {
  if (!err) return res.status(500).json({ error: "Unknown error" });

  // Zod validation errors -> 400
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation Error", details: err.issues });
  }

  // custom errors with status
  if (err?.status && err?.message) {
    return res.status(err.status).json({ error: err.message });
  }

  // fallback
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
}
