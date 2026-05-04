# Maariv Mini App

A full-stack Hebrew RTL news mini-application built as a home assignment.  
The project includes a Next.js frontend and an ASP.NET Core Web API backend that serves article, tag, and category data from JSON-formatted text files.

---

## Features

- Dynamic article pages: `/article/[id]`
- Dynamic tag pages: `/tags/[id]`
- ASP.NET Core Web API backend that reads JSON-formatted `.txt` files
- No-cache frontend data fetching with `cache: "no-store"`
- Viewport-based lazy loading for the "כתבות נוספות" section
- Native browser share button using `navigator.share`
- Redirect handling for `/tags/33`
- Custom 404 and loading pages
- RTL Hebrew responsive layout
- Frontend-to-backend error logging
- Render deployment for both frontend and backend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, App Router, TypeScript, Tailwind CSS v4 |
| Backend | ASP.NET Core Web API, .NET 9, C# |
| Data Source | JSON-formatted `.txt` files |
| Logging | Serilog + frontend log endpoint |
| Deployment | Render |

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://maariv-mini-app.onrender.com](https://maariv-mini-app.onrender.com) |
| Backend API | [https://maariv-backend.onrender.com](https://maariv-backend.onrender.com) |

Both services are deployed on [Render.com](https://render.com).

- The backend runs as a Docker container.
- The frontend runs as a Node.js web service.

> **Note:** Render free-tier services may spin down after inactivity.  
> The first request after a cold start can take 30–60 seconds.

---

## Project Structure

```txt
maariv-mini-app/
├── backend/               # ASP.NET Core Web API
│   ├── Controllers/       # ArticlesController, TagsController, CategoriesController, LogsController, HealthController
│   ├── Data/              # Data.txt, DataTags.txt, DataCategories.txt
│   ├── DTOs/              # ApiResponse<T>, ErrorResponse, ApiError
│   ├── logs/              # Daily rolling log files written by Serilog (gitignored)
│   ├── Models/            # Article, Tag, ArticleTag, Category, FrontendLogEntry
│   ├── Services/          # ArticleService, TagService, CategoryService, FrontendLogService, FileDataReader
│   ├── Dockerfile         # Multi-stage Docker build for Render deployment
│   └── Program.cs
│
└── frontend/              # Next.js app
    └── src/
        ├── app/           # Pages: /, /article/[id], /tags/[id], 404, loading
        ├── components/    # ArticleContent, ArticleTags, AdditionalArticlesLazy, ShareButton
        ├── config/        # redirects.ts
        ├── services/      # apiClient, articleService, tagService, loggerService
        └── types/         # article.ts, tag.ts, api.ts
```

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

---

## Running the App Locally

The backend should run before the frontend because the frontend fetches all data from the backend API.

### Option 1 — Run both apps together

From the project root:

```bash
npm install
npm run dev
```

This starts both servers using `concurrently`.

- Backend output is prefixed with `[backend]`
- Frontend output is prefixed with `[frontend]`
- The frontend waits for the backend to be ready before starting
- Press `Ctrl+C` once to stop both servers

### Option 2 — Run each app separately

#### Backend

From the project root:

```bash
dotnet run --project backend/MaarivMiniApp.Api.csproj
```

Backend URL:

```txt
http://localhost:5166
```

#### Frontend

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:3000
```

---

## Environment Variables

### Frontend

Create a `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5166
```

This variable is required.  
If it is missing, the frontend will throw an error on startup.

On Render, it is set to:

```env
NEXT_PUBLIC_API_BASE_URL=https://maariv-backend.onrender.com
```

### Backend

On Render, the following environment variable configures CORS for the deployed frontend:

```env
Cors__AllowedOrigins__0=https://maariv-mini-app.onrender.com
```

Locally, the allowed origin defaults to:

```txt
http://localhost:3000
```

This is configured in `appsettings.json`.

---

## API Endpoints

All backend endpoints are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check. Returns `{ "status": "ok" }` |
| `GET` | `/api/articles` | Returns all articles |
| `GET` | `/api/articles/{id}` | Returns a single article by numeric ID |
| `GET` | `/api/articles/additional?excludeId={id}` | Returns all articles excluding the given article ID |
| `GET` | `/api/tags` | Returns all tags |
| `GET` | `/api/tags/{id}` | Returns a single tag by numeric ID |
| `GET` | `/api/categories/{id}` | Returns a category name by numeric ID |
| `GET` | `/api/categories/search?prefix={prefix}` | Returns active categories whose name starts with the given prefix |
| `POST` | `/api/logs` | Receives frontend log entries |

---

## API Response Shapes

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

---

## Data Files

Data is stored as JSON arrays in `.txt` files under `backend/Data/`.

The `.txt` extension is intentional.  
The files are plain-text snapshots that contain JSON-formatted data.

| File | Contents |
|---|---|
| `Data.txt` | Articles: `id`, `title`, `description`, `body`, `date`, `imageURL`, `imageCredit`, `tags` |
| `DataTags.txt` | Tags: `tagId`, `tagName`, `tagImage` |
| `DataCategories.txt` | Categories: `categoryId`, `categoryName`, `active` |

The files are included in both the local build output and the Docker publish output through a `<Content>` entry in the `.csproj` file.

---

## Design Decisions

### Backend-first data flow

The frontend does not read the data files directly.

Data flow:

```txt
Data.txt / DataTags.txt / DataCategories.txt
        ↓
ASP.NET Core Web API
        ↓
Next.js frontend
        ↓
Article and tag pages
```

This keeps a clear separation between backend and frontend responsibilities.

---

### No-cache behavior

Every API call from the frontend uses:

```ts
fetch(url, { cache: "no-store" });
```

This ensures that:

- Every page refresh fetches fresh data from the backend
- Next.js does not serve stale cached data between navigations
- The app follows the assignment requirement for no-cache fetching

If the backend data rarely changes and performance becomes more important, this could later be changed to time-based revalidation.

Example:

```ts
fetch(url, { next: { revalidate: 60 } });
```

---

### Additional Articles lazy loading

The "כתבות נוספות" section is lazy-loaded using the Intersection Observer API.

Behavior:

1. The article page loads first.
2. The Additional Articles section appears lower on the page.
3. No extra request is made until the user scrolls to that section.
4. When the section enters the viewport, the frontend calls:

```txt
GET /api/articles/additional?excludeId={id}
```

5. The backend returns all articles except the current article.
6. The frontend renders those articles as links.

This avoids unnecessary network requests for users who do not scroll to the bottom of the article.

---

### Native share button

The article page includes a share button using the browser `navigator.share` API.

The share button is implemented as a Client Component because `navigator.share` is only available in the browser.

If native sharing is unavailable, the app falls back gracefully and does not break the page.

---

### Tag redirect

Visiting:

```txt
/tags/33
```

redirects to Maariv’s external tag page for "בנימין נתניהו":

```txt
https://www.maariv.co.il/tags/%D7%91%D7%A0%D7%99%D7%9E%D7%99%D7%9F-%D7%A0%D7%AA%D7%A0%D7%99%D7%94%D7%95
```

The redirect is handled by `src/proxy.ts` using a permanent redirect.

The redirect map is stored in:

```txt
frontend/src/config/redirects.ts
```

This makes it easy to add more redirects later without changing page logic.

---

### Frontend error logging

When a frontend API call fails, the app:

1. Logs the error locally with `console.error`
2. Sends a structured log entry to the backend using:

```txt
POST /api/logs
```

3. The backend writes the log using Serilog

Frontend log entries include information such as:

- log level
- source
- message
- details
- path
- timestamp

Logging failures are intentionally silent.  
A broken logging request should never crash or degrade the user-facing UI.

---

### Backend logging

The backend uses Serilog for structured logging.

Logs are written to:

- the console
- rolling daily log files under `backend/logs/`

The `backend/logs/` folder is gitignored.

Log files roll daily and are retained for 30 days.

---

### RTL layout

The app is built for Hebrew right-to-left content.

Key decisions:

- The root layout uses:

```html
<html lang="he" dir="rtl">
```

- Tailwind logical properties such as `ps-`, `pe-`, `ms-`, and `me-` are preferred over hardcoded `left` and `right`
- Numeric dates are wrapped with:

```html
<time dir="ltr">
```

This prevents RTL digit reordering issues.

---

### Deployment

The backend is deployed as a Docker-based Render web service.

The backend Dockerfile uses a multi-stage build:

- build stage: full .NET SDK image
- runtime stage: lean ASP.NET runtime image

The frontend is deployed as a Render Node.js web service.

The frontend start script uses:

```bash
next start -p ${PORT:-3000}
```

This allows the app to use the `PORT` environment variable injected by Render.

---

## Important Notes

- The backend should be running before using the frontend locally.
- Render free-tier services may sleep after inactivity, so the first request can be slow.
- Data files are committed intentionally because they are part of the assignment input.
- The project is read-only. There are no create, update, or delete operations for articles or tags.
- The `/tags/33` route redirects externally and does not render the internal tag page.

---

## Suggested Test URLs

### Backend

```txt
https://maariv-backend.onrender.com/api/health
https://maariv-backend.onrender.com/api/articles
https://maariv-backend.onrender.com/api/tags
```

### Frontend

```txt
https://maariv-mini-app.onrender.com/article/1079311
https://maariv-mini-app.onrender.com/tags/17
https://maariv-mini-app.onrender.com/tags/33
```

`/tags/33` should redirect to the external Maariv page.
