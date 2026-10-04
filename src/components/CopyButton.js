"use client";
import { useState } from "react";

export default function CopyButton({ text, small = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-btn"
      style={
        small
          ? { fontSize: "0.6rem", padding: "0.25rem 0.5rem" }
          : {}
      }
    >
      {copied ? "✓ Kopiert" : "Kopieren"}
    </button>
  );
}
