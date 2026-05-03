import type { Metadata } from "next";
import "./globals.css";

/**
 * Site-wide metadata consumed by Next.js for `<title>`, Open Graph, and similar tags.
 * Individual routes can override or extend via their own `metadata` exports if needed.
 */
export const metadata: Metadata = {
  title: "Maariv Mini App",
  description: "מאמרים ותגיות של מעריב",
};

/**
 * Root layout — wraps **every** page in the App Router.
 *
 * - Imports `globals.css` once so Tailwind base styles and custom utilities apply app-wide.
 * - Sets `lang="he"` and `dir="rtl"` on `<html>` so the entire document inherits correct language
 *   and right-to-left layout for Hebrew content (logical properties in components still work as expected).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      {/* No extra wrapper — route segments (pages, templates, loading, error) render as {children}. */}
      <body>{children}</body>
    </html>
  );
}
