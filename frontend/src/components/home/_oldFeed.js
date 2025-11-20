"use client";
import React, { useEffect } from "react";
import TouiteComposer from "../touite/TouiteComposer";
import TouiteFlow from "../touite/TouiteFlow";
import { useLanguage } from "../param/LanguageContext";
import useInfiniteTouites from '../../utils/touitesApi';
import { useTouites } from "../../context/TouiteContext";

export default function Feed() {
  const { t } = useLanguage();

  const { touites, hasMore, loading, loadMore, refresh } = useInfiniteTouites();

  useEffect(() => {
    const touiteList = document.getElementById("touiteList");
    if (!touiteList) return;

    const handleScroll = () => {
      if (
        touiteList.scrollTop + touiteList.clientHeight >= touiteList.scrollHeight - 100 &&
        hasMore && !loading
      ) {
        loadMore();
      }
    };

    touiteList.addEventListener('scroll', handleScroll);
    return () => touiteList.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMore]);

  return (
    <div className="flex-1 bg-[color:var(--backgroundGray)]">
      <div className="p-4 font-bold text-xl text-[color:var(--foreground)]">
        <a href="/home">
          {t("home") || "Accueil"}
        </a>
      </div>

      <div className="rounded-xl">
        <div className="bg-[color:var(--background)] relative max-w-2xl mx-auto z-10 mx-8">
          <TouiteComposer onPost={refresh} />
        </div>

        <TouiteFlow touites={touites} onRefresh={refresh} onlyRoot={true}/>
        
      </div>
    </div>
  );
}
