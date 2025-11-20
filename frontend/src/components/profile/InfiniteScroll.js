import { useEffect } from "react";

export function useInfiniteScroll({ containerId, hasMore, loading, loadMore }) {
  useEffect(() => {
    const feedList = document.getElementById(containerId);
    if (!feedList) return;

    const handleScroll = () => {
      if (
        feedList.scrollTop + feedList.clientHeight >= feedList.scrollHeight - 100 &&
        hasMore && !loading
      ) {
        loadMore();
      }
    };

    feedList.addEventListener('scroll', handleScroll);
    return () => feedList.removeEventListener('scroll', handleScroll);
  }, [containerId, hasMore, loading, loadMore]);
}