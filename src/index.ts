import express, { Request, Response, NextFunction } from "express";
import authorsRouter from "./routes/authors";
import booksRouter from "./routes/books";
import loggerMiddleware from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json()); //these two lines of code are an example of build-in middleware
//they are essential for parsing incoming json data from the body of a req.
//app.use(bodyParser.json())
// what is done is that we are converting json data from the req. body into a javascript object

app.use(loggerMiddleware); // logs every incoming req. to the index.ts 

app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

app.get("/", (_req: Request, res: Response) =>
  res.json({ ok: true, service: "Library API (in-memory)" })
);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) =>
  errorHandler(err, res)
);

//listen to incoming resquests, then the server can start on Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Library API running on http://localhost:${PORT}`)
);

