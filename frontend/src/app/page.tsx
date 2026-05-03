import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "../services/articleService";
import type { Article } from "../types/article";

/**
 * Application homepage — lists every article returned by `GET /api/articles`.
 *
 * - **Server Component** — data is fetched on the server during the request (with `cache: "no-store"`
 *   via `apiClient`), so the first paint includes the full list without a client-side loading spinner.
 * - **Resilience** — if the API is down or unreachable, the catch block falls back to an empty array
 *   so the page still renders a friendly Hebrew message instead of a Next.js error boundary.
 */
export default async function HomePage() {
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
  } catch {
    // Swallow errors intentionally — homepage is a convenience; broken backend should not crash the route.
    articles = [];
  }

  return (
    <main className="page-container flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 pb-5">
        {/* Static asset from public/ — priority so LCP is not delayed by lazy loading. */}
        <Image src="/Maariv.png" alt="מעריב" width={200} height={60} priority className="h-14 w-auto" />
        <h2 className="text-lg font-bold">כתבות אחרונות</h2>
      </header>

      {articles.length === 0 ? (
        <p className="text-base">לא נמצאו כתבות.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-300">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/article/${article.id}`}
                className="flex flex-col gap-1 py-4 group"
              >
                <h3 className="text-base font-bold group-hover:text-blue-700 transition-colors leading-snug">
                  {article.title}
                </h3>
                {/* line-clamp-2 keeps list rows compact on mobile without overflowing the viewport. */}
                <p className="text-base line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
                <time dir="ltr" className="text-sm mt-1">
                  {/* dir="ltr" — same as article page: keep numeric dates readable in RTL layout. */}
                  {article.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
