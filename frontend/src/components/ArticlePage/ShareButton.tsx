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
    <div className="flex flex-col items-start gap-1">
      <button onClick={handleShare} aria-label="שתף כתבה" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Image src="/share-icon.svg" alt="שתף" width={20} height={20} unoptimized />
        <span className="text-sm">שתף</span>
      </button>
      {copied && (
        <p className="text-xs text-green-600">הקישור הועתק ללוח!</p>
      )}
    </div>
  );
}
