# Maariv Mini App

A monorepo containing a Hebrew news mini-application built as a home assignment.

- **Backend** — ASP.NET Core Web API (.NET 9)
- **Frontend** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4, RTL)

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | [https://maariv-mini-app.onrender.com](https://maariv-mini-app.onrender.com) |
| Backend API | [https://maariv-backend.onrender.com](https://maariv-backend.onrender.com) |

Both services are deployed on [Render.com](https://render.com). The backend runs as a Docker container (.NET 9), and the frontend runs as a Node.js web service (Next.js).

> **Note:** Render free-tier services spin down after inactivity. The first request after a cold start may take 30–60 seconds.

---

## Project Structure

```
maariv-mini-app/
├── backend/               # ASP.NET Core Web API
│   ├── Controllers/       # ArticlesController, TagsController, CategoriesController, LogsController, HealthController
│   ├── Data/              # Data.txt (articles), DataTags.txt (tags), DataCategories.txt (categories)
│   ├── DTOs/              # ApiResponse<T>, ErrorResponse, ApiError
│   ├── logs/              # Daily rolling log files written by Serilog (gitignored)
│   ├── Models/            # Article, Tag, ArticleTag, Category, FrontendLogEntry
│   ├── Services/          # ArticleService, TagService, CategoryService, FrontendLogService, FileDataReader
│   ├── Dockerfile         # Multi-stage Docker build for Render deployment
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

## Running the App Locally

### Option 1 — Both at once (recommended)

From the `maariv-mini-app/` root:

```bash
npm install
npm run dev
```

This uses [`concurrently`](https://github.com/open-cli-tools/concurrently) to start both servers in one terminal. Backend output is prefixed `[backend]` (cyan) and frontend `[frontend]` (magenta). The frontend waits for the backend to be ready before starting. Press `Ctrl+C` once to stop both.

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

### Frontend

Create `frontend/.env.local` (gitignored):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5166
```

This is the only required environment variable. If it is missing the frontend will throw an error on startup.

On Render, this is set to the backend's public URL:
```
NEXT_PUBLIC_API_BASE_URL=https://maariv-backend.onrender.com
```

### Backend

On Render, the following environment variable configures CORS to allow the deployed frontend:

```
Cors__AllowedOrigins__0=https://maariv-mini-app.onrender.com
```

Locally, the allowed origin defaults to `http://localhost:3000` (configured in `appsettings.json`).

---

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — returns `{ "status": "ok" }` |
| `GET` | `/api/articles` | All articles |
| `GET` | `/api/articles/{id}` | Single article by numeric ID |
| `GET` | `/api/articles/additional?excludeId={id}` | All articles excluding the given ID |
| `GET` | `/api/tags` | All tags |
| `GET` | `/api/tags/{id}` | Single tag by numeric ID |
| `GET` | `/api/categories/{id}` | Category name by numeric ID |
| `GET` | `/api/categories/search?prefix={prefix}` | Active categories whose name starts with the given prefix (case-insensitive) |
| `POST` | `/api/logs` | Receive a frontend log entry |

### Response shapes

**Success (2xx):**
```json
{ "success": true, "data": ... }
```

**Error (4xx / 5xx):**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

---

## Data Files

Data is stored as JSON arrays in `.txt` files under `backend/Data/`. The `.txt` extension is intentional — it signals that these are plain text snapshots, not a live database.

| File | Contents |
|------|----------|
| `Data.txt` | Articles (`id`, `title`, `description`, `body`, `date`, `imageURL`, `imageCredit`, `tags`) |
| `DataTags.txt` | Tags (`tagId`, `tagName`, `tagImage`) |
| `DataCategories.txt` | Categories (`categoryId`, `categoryName`, `active`) |

The files are included in both the local build output and the Docker publish output via a `<Content>` entry in the `.csproj`.

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

Visiting `/tags/33` redirects to the external Maariv tag page for "בנימין נתניהו". The redirect is handled at the edge by `src/proxy.ts` (Next.js 16 edge middleware) using a permanent 308 redirect. The redirect map lives in `src/config/redirects.ts` so new redirects can be added without touching routing logic.

Tags that are known to redirect externally are rendered as plain `<a>` elements in the UI (rather than `next/link`) to avoid RSC prefetch errors in the browser console.

### Lazy loading

The "כתבות נוספות" (Additional Articles) section on each article page uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to defer the API call until the section scrolls into view. This means users who don't scroll to the bottom never trigger the extra network request.

### RTL layout

The app is built for right-to-left Hebrew content. Key decisions:
- `<html lang="he" dir="rtl">` is set in the root layout.
- Tailwind's [logical properties](https://tailwindcss.com/docs/padding#using-logical-properties) (e.g. `ps-`, `pe-`, `ms-`, `me-`) are used instead of physical `left`/`right` wherever possible.
- Numeric dates (e.g. `26/02/2024`) are wrapped in `<time dir="ltr">` to prevent RTL reordering of the digits.

### Deployment

The backend is containerized with a multi-stage Dockerfile — the build stage uses the full .NET 9 SDK image and the runtime stage uses the lean `aspnet` image, keeping the final container small. The frontend is deployed as a plain Node.js service; the `start` script uses `next start -p ${PORT:-3000}` to pick up the `PORT` environment variable that Render injects automatically.
