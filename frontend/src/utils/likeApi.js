import axios from "axios";
import { useState, useEffect } from 'react';

const API_URL = process.env.NODE_ENV === "production"
  ? "https://api.touiteur.be:3000"
  : "http://localhost:3002/api";

export async function getLikesCount(touiteId) {
  try {
    const res = await axios.get(`${API_URL}/likes/count/${touiteId}`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function addLike({ userId, touiteId }) {
  try {
    const res = await axios.post(`${API_URL}/likes`, { userId, touiteId }, {withCredentials: true});
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function removeLike({ userId, touiteId }) {
  try {
    const res = await axios.delete(`${API_URL}/likes`, { 
      data: { userId, touiteId }, 
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function hasLike({ userId, touiteId }) {
  try {
    const res = await axios.get(`${API_URL}/likes/hasLike`, {
      params: { userId, touiteId },
      withCredentials: true // Ensure cookies are sent
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export function useInfiniteLikesFromUser(userId) {
  const limit = 20;
  
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    if (!userId || userId == undefined) return;
    const loadLikes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/likes/user/${userId}?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        setLikes(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadLikes();
  }, [page, userId, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { likes, hasMore, loading, loadMore, refresh };
}