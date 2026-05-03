"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Icon-only share control for the current article URL.
 *
 * Behaviour (progressive enhancement):
 * 1. `navigator.share` when available (mobile browsers / some desktop browsers).
 * 2. Otherwise copies the URL to the clipboard and shows a short confirmation tooltip.
 * 3. If clipboard access fails (permission / non-secure context), falls back to `alert` with the URL.
 *
 * User cancellation of the native share sheet is intentionally ignored — it is not an error.
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // User dismissed the sheet — not an error condition.
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
        type="button"
        onClick={handleShare}
        aria-label="שתף כתבה"
        className="p-1 rounded cursor-pointer active:scale-95 transition-transform"
      >
        {/* unoptimized: small local SVG — skip the image optimizer pipeline for faster dev and simpler caching. */}
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
