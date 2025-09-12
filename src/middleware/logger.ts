import { Request, Response, NextFunction } from "express";

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();//custome middleware, tells express to move on to the next route handler
  }
//middlewares are functions that have access to the req & res object, as well as the next middleware function
// helps us debug, monitor server activity as well as understand the flow of traffic in our application