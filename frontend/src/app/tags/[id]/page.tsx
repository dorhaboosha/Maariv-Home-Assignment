import { notFound } from "next/navigation";
import { getTagById } from "../../../services/tagService";
import { logError } from "../../../services/loggerService";
import type { Tag } from "../../../types/tag";

interface TagPageProps {
  params: Promise<{ id: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { id } = await params;

  let tag: Tag;
  try {
    tag = await getTagById(id);
  }
   catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) {
      notFound();
    }
    
    logError("Failed to fetch tag", "TagPage", String(err));
    throw err;
  }

  return (
    <main className="page-container">
      <p>{tag.tagName}</p>
    </main>
  );
}
