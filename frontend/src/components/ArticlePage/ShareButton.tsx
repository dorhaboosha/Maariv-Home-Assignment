"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // user cancelled the share dialog — not an error
      }
      return;
    }

    // fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`העתק את הקישור: ${url}`);
    }
  }

  return (
    <div className="border-t border-gray-100 pt-4 flex flex-col items-start gap-2">
      <button onClick={handleShare} aria-label="שתף כתבה" 
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-sm font-medium">
        <Image src="/share-icon.svg" alt="שתף" width={20} height={20} unoptimized />
        שתף כתבה
      </button>
      {copied && (
        <p className="text-xs text-green-600">הקישור הועתק ללוח!</p>
      )}
    </div>
  );
}
