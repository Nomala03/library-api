import { Request, Response, NextFunction } from "express";

export default function logger(req: Request, res: Response, next: NextFunction) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
}
