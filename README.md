# Maariv Mini App

A monorepo containing a Hebrew news mini-application built as a home assignment.

- **Backend** — ASP.NET Core Web API (.NET 9)
- **Frontend** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4, RTL)

---

## Project Structure

```
maariv-mini-app/
├── backend/               # ASP.NET Core Web API
│   ├── Controllers/       # ArticlesController, TagsController, CategoriesController, LogsController
│   ├── Data/              # Data.txt (articles), DataTags.txt (tags), DataCategories.txt (categories)
│   ├── DTOs/              # ApiResponse<T>, ErrorResponse, ApiError
│   ├── logs/              # Daily rolling log files written by Serilog (gitignored)
│   ├── Models/            # Article, Tag, ArticleTag, Category, FrontendLogEntry
│   ├── Services/          # ArticleService, TagService, CategoryService, FrontendLogService, FileDataReader
│   └── Program.cs
└── frontend/              # Next.js app
    └── src/
        ├── app/           # Pages: /, /article/[id], /tags/[id], 404, loading
        ├── components/    # ArticleContent, ArticleTags, AdditionalArticlesLazy, ShareButton
        ├── config/        # redirects.ts (tag redirect map)
        ├── services/      # apiClient, articleService, tagService, loggerService
        └── types/         # article.ts, tag.ts, api.ts
```

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

---

## Running the App

### Option 1 — Both at once (recommended)

From the `maariv-mini-app/` root:

```bash
npm install
npm run dev
```

This uses [`concurrently`](https://github.com/open-cli-tools/concurrently) to start both servers in one terminal. Backend output is prefixed `[backend]` (cyan) and frontend `[frontend]` (magenta). Press `Ctrl+C` once to stop both.

### Option 2 — Separately

**Backend** (from `maariv-mini-app/`):
```bash
dotnet run --project backend/MaarivMiniApp.Api.csproj
```
Runs on `http://localhost:5166`

**Frontend** (from `maariv-mini-app/frontend/`):
```bash
npm install
npm run dev
```
Runs on `http://localhost:3000`

---

## Environment Variables

The frontend reads one environment variable from `frontend/.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5166
```

This file is gitignored. If it is missing, the frontend will throw an error on startup.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — returns `{ "status": "ok" }` |
| `GET` | `/api/articles` | All articles |
| `GET` | `/api/articles/{id}` | Single article by ID |
| `GET` | `/api/articles/additional?excludeId={id}` | Articles excluding the given ID |
| `GET` | `/api/tags` | All tags |
| `GET` | `/api/tags/{id}` | Single tag by ID |
| `GET` | `/api/categories/{id}` | Category name by ID |
| `GET` | `/api/categories/search?prefix={prefix}` | Active categories whose name starts with prefix |
| `POST` | `/api/logs` | Receive a frontend log entry |

All success responses follow the shape `{ "success": true, "data": ... }`.  
All error responses follow the shape `{ "success": false, "error": { "code": "...", "message": "..." } }`.

---

## Design Decisions

### No-cache behavior

Every API call from the frontend uses `{ cache: "no-store" }` (configured in `apiClient.ts`). This ensures:

- Pages always reflect the latest data from the backend on each request.
- Next.js does not serve stale cached RSC payloads between navigations.
- This is intentional for a news app where content freshness matters.

If the backend data rarely changes and performance becomes a concern, this could be changed to `{ next: { revalidate: 60 } }` (ISR) for time-based revalidation.

### Frontend error logging

When a frontend API call fails (article fetch, tag fetch, additional articles fetch), the app:

1. Calls `console.error` locally for developer visibility.
2. Sends a `POST /api/logs` request to the backend with a `FrontendLogEntry` payload containing the error message, source component, and timestamp.
3. The backend logs the entry using Serilog — visible in the terminal **and** persisted to a rolling daily file under `backend/logs/`.

Every log line is labelled `[Frontend]` or `[Backend]` so the two sources are easy to distinguish in the log file. Log files roll at midnight and are retained for 30 days. The `backend/logs/` folder is gitignored.

Logging failures are intentionally silent — a broken logging pipeline must never crash or degrade the user-facing UI. The fire-and-forget `POST` is wrapped in `.catch(() => {})`.

### Tag redirect

Visiting `/tags/33` redirects to the external Maariv tag page. The redirect is handled at the edge by `src/proxy.ts` (Next.js 16 edge middleware). The redirect map lives in `src/config/redirects.ts` so new redirects can be added without touching routing logic.

Tags that are known to redirect externally are also rendered as plain `<a>` elements in the UI (rather than `next/link`) to avoid RSC prefetch errors in the browser console.
