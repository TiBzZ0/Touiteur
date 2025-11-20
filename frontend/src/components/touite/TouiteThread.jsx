"use client";

import React, { useEffect, useState } from "react";
import Touite from "./Touite";
import Link from "next/link";
import { useLanguage } from "../param/LanguageContext";
import { getAccountById } from "../../utils/accountsApi";

export default function TouiteThread({ parent, current }) {
  const { t } = useLanguage();
  const [parentUser, setParentUser] = useState(null);

  useEffect(() => {
    if (parent?.accountId) {
      getAccountById(parent.accountId)
        .then(setParentUser)
        .catch(() => setParentUser(null));
    }
  }, [parent?.accountId]);

  return (
    <div className="bg-[color:var(--color-whitegray)] rounded-lg shadow-[0_0_4px_0_var(--brandDarker)]">
        {!parent && (
        <div className="p-4">
          <Link
            href="/home"
            className="inline-block text-[color:var(--color-brand)] underline hover:text-[color:var(--color-brand-dark)]"
          >
            {t("home") || "Accueil"}
          </Link>
        </div>
      )}
      {parent && (
        <div className="p-4 border-b border-[color:var(--backgroundGray)]">
          <div className="text-xs text-[color:var(--foreground)] mb-1">
            {t("replyTo") || "En réponse à @"}{parentUser?.username || parent.username}
          </div>
          <Touite
            accountId={parent.accountId}
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            fullName={parent.nickname}
            username={parent.username}
            time={parent.createdAt}
            content={parent.content}
            media={parent.files?.length > 0 ? parent.files : []}
            touiteId={parent._id}
            stats={{ retweets: parent.retweets }}
            compact={true}
          />
        </div>
      )}

      <div className="p-4">
        <Touite
          accountId={current.accountId}
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          fullName={current.nickname}
          username={current.username}
          time={current.createdAt}
          content={current.content}
          media={current.files?.length > 0 ? current.files : []}
          touiteId={current._id}
          stats={{ retweets: current.retweets }}
        />
      </div>
    </div>
  );
}
