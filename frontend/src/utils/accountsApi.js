import axios from "axios";
import { useState, useEffect } from 'react';
const API_URL = process.env.NODE_ENV === "production"
  ? 'https://api.touiteur.be:3000/accounts' // Production API address
  : 'http://localhost:3002/api/accounts';

export async function getUserProfile(userId) {
  const response = await axios.get(`${API_URL}/${userId}`, { withCredentials: true });
  return response.data;
}

export async function getUserByUsername(username) {
  const response = await axios.get(`${API_URL}/username/${username}`, { withCredentials: true });
  return response.data;
}

export async function getAccountById(accountId) {
  try {
    const res = await axios.get(`${API_URL}/${accountId}`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function banUserTemporarily(accountId, date) {
  try {
    const res = await axios.put(`${API_URL}/ban/${accountId}`, { date }, {
      withCredentials: true 
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAccounts() {
  try {
    const res = await axios.get(`${API_URL}/`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export function useInfinitePartialAccounts(partialAccounts) {
  const limit = 20;
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      if (!partialAccounts || partialAccounts == undefined) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/partial-username/${partialAccounts}?page=${page}&limit=${limit}`,
          { withCredentials: true }
        );
        setAccounts(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadAccounts();
  }, [page, partialAccounts, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { accounts, hasMore, loading, loadMore, refresh };
}

export async function setUserProfile(accountId, profileData) {
  try {
    const res = await axios.put(`${API_URL}/${accountId}`, profileData, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}