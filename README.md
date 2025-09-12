# library-api

Simple in-memory REST API to manage Authors and Books for a local community library.

## Run
1. npm install
2. npm run dev
Server: http://localhost:3000

## Endpoints

Authors
- POST /authors
- GET /authors
- GET /authors/:id
- PUT /authors/:id
- DELETE /authors/:id
- GET /authors/:id/books

Books
- POST /books
- GET /books (query: title, author, year, page, limit, sort, order)
- GET /books/:id
- PUT /books/:id
- DELETE /books/:id

## Validation
- All POST/PUT payloads validated. Missing authorId on book => 400.
- Duplicate book (same title + same author) => 409 Conflict.

## Search examples
- `GET /books?title=potter`
- `GET /books?author=J.K.%20Rowling` (partial author name) OR `?author=<authorId>`
- `GET /books?year=1997`
- Pagination: `?page=2&limit=10`
- Sorting: `?sort=title&order=asc`

## Error responses
- 400 Validation / Bad Request
- 404 Not Found
- 409 Conflict (duplicate book)
- 500 Server Error

## Testing
Use Postman or curl. Example:
Create author:
curl -X POST http://localhost:3000/authors -H "Content-Type: application/json" -d '{"name":"Jane Doe"}'

Create book:
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title":"My Book","authorId":"<id>","publishedAt":"2005-01-01"}'
