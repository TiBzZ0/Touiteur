"use client";

import { useState, useEffect } from "react";
import TouiteFlow from "@/components/touite/TouiteFlow";
import { useLanguage } from "../param/LanguageContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useInfiniteLikesFromUser } from "@/utils/likeApi";
import { useInfiniteAnswersFromUser } from "@/utils/touitesApi";
import { useInfiniteTouitesByAuthor } from "@/utils/touitesApi";
import { getTouiteFromId } from "@/utils/touitesApi";
import { useInfiniteScroll } from "./InfiniteScroll";

export default function ProfileFeedSelector({ userId }) {
  const [activeTab, setActiveTab] = useState("Touites");
  const { t } = useLanguage();
  const [parent] = useAutoAnimate();

  const brand = "var(--color-brand)";

  const { likes = [], hasMore: hasMoreLikes, loading: loadingLikes, loadMore: loadMoreLikes, refresh: refreshLikes } = useInfiniteLikesFromUser(userId);
  const { touites: answers = [], hasMore: hasMoreAnswers, loading: loadingAnswers, loadMore: loadMoreAnswers, refresh: refreshAnswers } = useInfiniteAnswersFromUser(userId);
  const { touites = [], hasMore: hasMoreTouites, loading: loadingTouites, loadMore: loadMoreTouites, refresh: refreshTouites } = useInfiniteTouitesByAuthor(userId);

  useEffect(() => {
    if (activeTab === "Touites") refreshTouites();
    if (activeTab === "Likes") refreshLikes();
    if (activeTab === "Answers") refreshAnswers();
  }, [activeTab, userId]);

  const LikesList = () => {
    const [likedTouites, setLikedTouites] = useState([]);

    useEffect(() => {
      let isMounted = true;
      Promise.all(likes.map(like => getTouiteFromId(like.touiteId)))
        .then(touites => {
          if (isMounted) setLikedTouites(touites.filter(Boolean));
        });
      return () => { isMounted = false; };
    }, [likes]);
    
    return (
      <TouiteFlow 
        container="LikesList"
        maxHeight="calc(100vh - 335px)"
        touites={likedTouites}
        onRefresh={refreshLikes}
      />
    );
  };
  const AnswersList = () => (
    <TouiteFlow
      container="AnswersList"
      maxHeight="calc(100vh - 335px)"
      touites={answers}
      onRefresh={refreshAnswers}
    />
  );
  const TouitesList = () => (
    <TouiteFlow
      container="TouitesList"
      maxHeight="calc(100vh - 335px)"
      touites={touites}
      onRefresh={refreshTouites}
    />
  );

  useInfiniteScroll({
      containerId: activeTab === "Touites" ? "TouitesList" : activeTab === "Likes" ? "LikesList" : "AnswersList",
      hasMore: activeTab === "Touites" ? hasMoreTouites : activeTab === "Likes" ? hasMoreLikes : hasMoreAnswers,
      loading: activeTab === "Touites" ? loadingTouites : activeTab === "Likes" ? loadingLikes : loadingAnswers,
      loadMore: activeTab === "Touites" ? loadMoreTouites : activeTab === "Likes" ? loadMoreLikes : loadMoreAnswers
    })

  return (
    <div className="bg-[color:var(--color-background)] p-8 rounded-2xl shadow-md w-full relative">
      <div className="flex justify-center mb-6 space-x-8">
        <button
          onClick={() => setActiveTab("Touites")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Touites" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Touites" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Touites
        </button>
        <button
          onClick={() => setActiveTab("Likes")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Likes" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Likes" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Likes
        </button>
        <button
          onClick={() => setActiveTab("Answers")}
          className={`text-lg font-semibold pb-2 ${activeTab === "Answers" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "Answers" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          Réponses
        </button>
      </div>
      {activeTab === "Touites" ? <TouitesList /> : activeTab === "Likes" ? <LikesList /> : <AnswersList />}
    </div>
  );
}