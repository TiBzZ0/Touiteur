"use client";

import React from "react";
import { InlineMath } from "react-katex";

export default function FormattedResponse({ text }) {
  if (!text) return null;

  const parts = text.split(/(\\\(.*?\\\))/g);

  return (
    <p className="text-[var(--foreground)]">
      {parts.map((part, i) => {
        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          const formula = part.slice(2, -2).trim();
          return <InlineMath key={i} math={formula} />;
        }
        return part.split('\n').map((line, j) =>
          j === 0 ? <span key={j + "-line"}>{line}</span> : [<br key={j + "-br"} />, <span key={j + "-line"}>{line}</span>]
        );
      })}
    </p>
  );
}
