"use client";

import { useState, useEffect } from "react";
import TouiteFlow from "@/components/touite/TouiteFlow";
import AccountFlow from "./AccountFlow";
import { useLanguage } from "../param/LanguageContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useInfiniteScroll } from "@/components/profile/InfiniteScroll";
import { useInfinitePartialAccounts } from "@/utils/accountsApi";
import { useInfiniteTouitesByTag } from "@/utils/touitesApi";

export default function SearchSelector({ searchQuery }) {
  const [research, setResearch] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState("Touites");
  const { t } = useLanguage();
  const [parent] = useAutoAnimate();

  const brand = "var(--color-brand)";

  const tag = activeTab === "Touites"
    ? (searchQuery?.startsWith("#") ? searchQuery.slice(1) : searchQuery)
    : "";
  
  const account = activeTab === "Accounts"
    ? (searchQuery?.startsWith("@") ? searchQuery.slice(1) : searchQuery)
    : "";

  const { touites = [], hasMore, loading, loadMore, refresh } = useInfiniteTouitesByTag(tag);
  const { accounts = [], hasMore: accountsHasMore, loading: accountsLoading, loadMore: accountsLoadMore, refresh: accountsRefresh } = useInfinitePartialAccounts(account);
  
  useEffect(() => {
    if (activeTab === "Touites"){
      refresh();
    }
    if (activeTab === "Accounts") {
      accountsRefresh();
    }
  }, [activeTab, tag, account]);


  const AccountList = () => (
    <AccountFlow
      container="AccountList"
      maxHeight="calc(100vh - 185px)"
      accounts={accounts}
      onRefresh={accountsRefresh}
    />
  );
  const TouitesList = () => (
    <TouiteFlow
      container="TouitesList"
      maxHeight="calc(100vh - 185px)"
      touites={touites}
      onRefresh={refresh}
    />
  );

  useInfiniteScroll({
      containerId: activeTab === "Touites" ? "TouitesList" : "AccountList",
      hasMore: activeTab === "Touites" ? hasMore : accountsHasMore,
      loading: activeTab === "Touites" ? loading : accountsLoading,
      loadMore: activeTab === "Touites" ? loadMore : accountsLoadMore
    });

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
          onClick={() => setActiveTab("Accounts")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Accounts" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Accounts" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Accounts
        </button>
      </div>
      {activeTab === "Touites" ? <TouitesList /> : <AccountList />}
    </div>
  );
}