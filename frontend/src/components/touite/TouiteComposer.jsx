"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../param/LanguageContext";
import { createTouite } from "../../utils/touitesApi";
import { useUser } from "@/context/UserContext";

export default function TouiteComposer({ onPost }) {
  const { t } = useLanguage();
  const { userId } = useUser();

  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || !userId) return;

    try {
      await createTouite({ authorId: userId, content });
      setContent("");
      if (onPost) onPost();
    } catch (err) {
      console.error("Erreur lors de la création du touite :", err);
    }
  };

  return (
    <div className="p-4 rounded-md animated-shadow">
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-[color:var(--text-grey)] rounded-full"></div>

        <textarea
          className="w-full resize-none border-none bg-transparent text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] rounded-md px-3 py-2 focus:ring-1 focus:ring-[rgba(139,92,246,0.3)] focus:outline-none"
          placeholder={t("whatsHappening") || "Quoi de neuf ?"}
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

      </div>

      <div className="flex justify-end mt-2">
        <button onClick={handleSubmit} className="bg-[color:var(--color-brand)] text-white font-bold py-2 px-4 rounded-full hover:bg-[color:var(--color-brand-dark)]">
          {t("touite") || "Touiter"}
        </button>
      </div>
    </div>
  );
}
