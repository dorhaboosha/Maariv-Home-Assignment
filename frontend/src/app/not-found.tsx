import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-container flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600">הדף לא נמצא</h2>
      <p className="text-gray-500 max-w-sm">המשאב שביקשת אינו קיים או שהכתובת שגויה.</p>
      <Link href="/" className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">חזרה לדף הבית</Link>
    </main>
  );
}
