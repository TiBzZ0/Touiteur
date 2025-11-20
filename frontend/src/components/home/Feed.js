"use client";
import React, { useState, useEffect } from "react";
import TouiteComposer from "../touite/TouiteComposer";
import { useLanguage } from "../param/LanguageContext";
import HomeFeedSelector from "./HomeFeedSelector";

export default function Feed() {
  const { t } = useLanguage();

  const [refreshBool, setRefreshBool] = useState(false);

  const refresh = () => {
    setRefreshBool(prev => !prev);
  };

  return (
    <div className="flex-1 h-screen bg-[color:var(--backgroundGray)]">

      <div className="rounded-xl pt-6">
        <div className="bg-[color:var(--background)] relative max-w-2xl mx-auto z-10 mx-8 ">
          <TouiteComposer onPost={refresh} />
        </div>

        <HomeFeedSelector useRefresh={{ refresh, refreshBool }} />
      </div>
    </div>
  );
}
