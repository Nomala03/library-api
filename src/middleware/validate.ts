import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * validate(schema) - returns middleware to validate req.body with Zod
 * If invalid, passes a ZodError to next() so centralized error handler returns 400.
 */
export function validate(schema: ZodType<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // parse will throw if invalid
       req.body = schema.parse(req.body); // ✅ req.body is now typed as T
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(err); // handled by your centralized error handler
      }
      next(err);
    }
  };
}
