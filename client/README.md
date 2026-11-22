# Library Catalog Client

React + Vite frontend for the Library Management System API.

## Setup

From this directory:

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the base URL of the NestJS API. The default is `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## API integration

- `GET /books` — paginated catalog; supports `search`, `genreId`, `page`, and `limit`.
- `GET /books/:id` — book detail.
- `GET /genres` — genre filters.

The catalog consumes the API's `{ data, meta }` pagination response. Search matches title and author as implemented by the API. Book covers and descriptions are not part of the current database schema, so the interface uses generated typographic cover artwork and does not fabricate book metadata.