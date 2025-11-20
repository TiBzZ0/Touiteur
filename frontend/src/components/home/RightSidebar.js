"use client";
import React from "react";
import { useLanguage } from "../param/LanguageContext";

export default function RightSidebar() {
  const { t } = useLanguage();

  return (
    <div className="w-96 p-4 bg-[color:var(--background)] shadow-[-4px_0_6px_-4px_var(--brandDarker)]">
      <div className="mb-4">
        <input
          type="text"
          placeholder={t("search") || "Rechercher"}
          className="w-full bg-[color:var(--color-brand-background)] rounded-full px-4 py-2 text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] focus:ring-1 focus:ring-[rgba(139,92,246,0.3)] focus:outline-none"
        />
      </div>


      <div className="bg-[color:var(--color-brand-background)] rounded-lg p-4">
        <div className="font-bold text-lg mb-2 text-[color:var(--foreground)]">{t("trends") || "Tendances"}</div>
        {[1, 2, 3].map((trend) => (
          <div key={trend} className="py-2 border-b border-[color:var(--background)]">
            <div className="text-sm text-[color:var(--text-grey)]">{t("trend")} {trend}</div>
            <div className="font-semibold text-[color:var(--foreground)]">#hashtag{trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
