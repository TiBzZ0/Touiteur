"use client";

import { useState, useEffect } from "react";
import TouiteFlow from "@/components/touite/TouiteFlow";
import { useLanguage } from "../param/LanguageContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import useInfiniteTouites from "@/utils/touitesApi";
import { useInfiniteTouitesByAccounts } from "@/utils/touitesApi";
import { getFollowing } from "@/utils/followApi";
import { useInfiniteScroll } from "@/components/profile/InfiniteScroll";

import { useUser } from "@/context/UserContext";

export default function HomeFeedSelector({ useRefresh }) {
  const [activeTab, setActiveTab] = useState("Touites");
  const [following, setFollowing] = useState([]);
  const { t } = useLanguage();
  const [parent] = useAutoAnimate();
  const { userId } = useUser();
  const { refresh: useRefreshBool, refreshBool } = useRefresh;

  const brand = "var(--color-brand)";

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId || userId == undefined) return;
      try {
        const following = await getFollowing(userId);
        setFollowing(following);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };
    fetchFollowing();
  }, [userId]);

  const { touites = [], hasMore, loading, loadMore, refresh } = useInfiniteTouites();
  const { touites: PersonnalTouites = [], hasMore: PersonnalHasMore, loading: PersonnalLoading, loadMore: PersonnalLoadMore, refresh: PersonnalRefresh } = useInfiniteTouitesByAccounts(following);

  useEffect(() => {
    if (activeTab === "Touites"){
      refresh();
    }
    if (activeTab === "PersonnalFeed") {
      refreshPersonnal();
    }
  }, [activeTab, userId, refreshBool]);


  const PersonnalList = () => (
    <TouiteFlow
      container="PersonnalList"
      maxHeight="calc(100vh - 260px)"
      touites={PersonnalTouites}
      onRefresh={PersonnalRefresh}
    />
  );
  const TouitesList = () => (
    <TouiteFlow
      container="TouitesList"
      maxHeight="calc(100vh - 260px)"
      touites={touites}
      onRefresh={refresh}
    />
  );

  useInfiniteScroll({
      containerId: activeTab === "Touites" ? "TouitesList" : "PersonnalList",
      hasMore: activeTab === "Touites" ? hasMore : PersonnalHasMore,
      loading: activeTab === "Touites" ? loading : PersonnalLoading,
      loadMore: activeTab === "Touites" ? loadMore : PersonnalLoadMore
    })

  return (
    <div className="my-3 mx-30 relative">
      <div className="flex justify-center space-x-8">
        <button
          onClick={() => setActiveTab("Touites")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Touites" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Touites" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Touites
        </button>
        <button
          onClick={() => setActiveTab("Following")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Following" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Following" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Following
        </button>
      </div>
      {activeTab === "Touites" ? <TouitesList /> : <PersonnalList />}
    </div>
  );
}