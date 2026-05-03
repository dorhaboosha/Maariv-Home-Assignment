"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAdditionalArticles } from "../../services/articleService";
import { logError } from "../../services/loggerService";
import type { Article } from "../../types/article";

interface AdditionalArticlesLazyProps {
  excludeId: number;
}

export default function AdditionalArticlesLazy({ excludeId }: AdditionalArticlesLazyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        observer.disconnect();
        setLoading(true);

        getAdditionalArticles(excludeId)
          .then((data) => {
            setArticles(data);
          })
          .catch((err: unknown) => {
            logError(
              "Failed to load additional articles",
              "AdditionalArticlesLazy",
              String(err)
            );
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [excludeId]);

  return (
    <section ref={sectionRef} className="border-t border-gray-100 pt-4 flex flex-col gap-3">
      <h2 className="text-lg font-bold">כתבות נוספות</h2>

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-gray-200 rounded w-4/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">לא ניתן לטעון כתבות נוספות כרגע.</p>
      )}

      {articles && articles.length > 0 && (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
              <Link href={`/article/${article.id}`} className="text-sm text-blue-700 hover:underline leading-snug">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {articles && articles.length === 0 && !loading && (
        <p className="text-sm text-gray-400">אין כתבות נוספות.</p>
      )}
    </section>
  );
}
