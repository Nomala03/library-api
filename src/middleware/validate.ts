import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

/*
  validate(schema) - returns middleware to validate req.body with Zod
  If invalid, passes a ZodError to next() so centralized error handler returns 400.
 */

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; 
      console.log("Validated body:", parsed);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        console.error("Validation failed:", err);
        return next(err);
      }
      next(err);
    }
  };
}
