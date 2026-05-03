import { notFound } from "next/navigation";
import Image from "next/image";
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
    <main className="page-container flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold">{tag.tagName}</h1>

      {tag.tagImage && (
        <div className="relative w-full aspect-video rounded overflow-hidden">
          <Image src={tag.tagImage} alt={tag.tagName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
        </div>
      )}
    </main>
  );
}
