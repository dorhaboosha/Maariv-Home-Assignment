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
        // user cancelled — not an error
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`העתק את הקישור: ${url}`);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        aria-label="שתף כתבה"
        className="p-1 rounded cursor-pointer active:scale-95 transition-transform"
      >
        <Image
          src="/share-icon.svg"
          alt="שתף"
          width={22}
          height={22}
          unoptimized
        />
      </button>
      {copied && (
        <span className="absolute top-8 start-0 text-xs text-green-600 whitespace-nowrap bg-white border border-gray-200 rounded px-2 py-1 shadow-sm">
          הקישור הועתק!
        </span>
      )}
    </div>
  );
}
