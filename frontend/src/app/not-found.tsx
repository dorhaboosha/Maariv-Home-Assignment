import Link from "next/link";

/**
 * Global 404 UI for the App Router.
 *
 * Next.js renders this file when:
 * - A route does not match any `page.tsx` (e.g. `/some-random-path`), or
 * - A Server Component calls `notFound()` (e.g. article or tag ID not found in the API).
 *
 * This is a **Server Component** by default — no `"use client"` needed because the page is static markup
 * plus a regular navigation link back to the homepage.
 */
export default function NotFound() {
  return (
    <main className="page-container flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">הדף לא נמצא</h2>
      <p className="max-w-sm">
        המשאב שביקשת אינו קיים או שהכתובת שגויה.
      </p>
      {/* Client-side navigation home — avoids a full document reload compared to <a href="/">. */}
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </main>
  );
}
