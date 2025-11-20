import axios from "axios";
import { useState, useEffect } from 'react';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000' // Production API address
  : 'http://localhost:3001/api'; // Local API address for testing

export default function useInfiniteTouites() {
  const limit = 20;
  const [touites, setTouites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadTouites = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/touites?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        setTouites(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadTouites();
  }, [page, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { touites, hasMore, loading, loadMore, refresh };
}

export async function createTouite({ authorId, content }) {
  const tags = (content.match(/#\w+/g) || []).map(tag => tag.slice(1));
  const response = await axios.post(''+API_URL+'/touites', {
    accountId: authorId,
    content,
    tags
  }, {
    withCredentials: true
  });

  return response.data;
}

export async function getTouite(id) {
  const res = await axios.get(`${API_URL}/touites/${id}`, {
    withCredentials: true
  });
  return res.data;
}

export async function getTouiteAnswers(touiteId) {
  try {
    const res = await axios.get(`${API_URL}/touites/${touiteId}/answers`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTouiteAnswersCount(touiteId) {
  try {
    const res = await axios.get(`${API_URL}/touites/${touiteId}/answers/count`, {
      withCredentials: true
    });
    return res.data.count ?? 0;
  } catch (error) {
    throw error;
  }
}

export async function postTouiteAnswer({ touiteId, content, accountId }) {
  try {
    const res = await axios.post(`${API_URL}/touites/${touiteId}/answers`, {
      content,
      accountId
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTouite(touiteId) {
  try {
    const res = await axios.delete(`${API_URL}/touites/${touiteId}`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export function useInfiniteTouitesByAuthor(authorId) {
  const limit = 20;
  const [touites, setTouites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadTouites = async () => {
      setLoading(true);
      if (!authorId || authorId == undefined) return;
      try {
        const res = await axios.get(`${API_URL}/touites/account/${authorId}?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        setTouites(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadTouites();
  }, [page, authorId, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { touites, hasMore, loading, loadMore, refresh };
}


export async function getTouiteFromId(touiteId) {
  try {
    const res = await axios.get(`${API_URL}/touites/${touiteId}`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}


export function useInfiniteAnswersFromUser(userId) {
  const limit = 20;
  const [touites, setTouites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadTouites = async () => {
      if (!userId || userId == undefined) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/touites/answers/${userId}?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        setTouites(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadTouites();
  }, [page, userId, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { touites, hasMore, loading, loadMore, refresh };
}

export function useInfiniteTouitesByAccounts(accountsId) {
  const limit = 20;
  const [touites, setTouites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadTouites = async () => {
      if (!accountsId || accountsId == undefined || accountsId.length === 0) return;
      setLoading(true);
      try {
        const ids = accountsId.map(acc => typeof acc === "string" ? acc : acc.followingId);
        const res = await axios.post(`${API_URL}/touites/by-accounts?page=${page}&limit=${limit}`, 
          { accounts: ids },
          { withCredentials: true }
        );
        setTouites(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadTouites();
  }, [page, accountsId, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { touites, hasMore, loading, loadMore, refresh };
}

export function useInfiniteTouitesByTag(tag) {
  const limit = 20;
  const [touites, setTouites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshBool, setRefreshBool] = useState(false);

  useEffect(() => {
    const loadTouites = async () => {
      if (!tag || tag == undefined) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/touites/tag/${tag}?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        setTouites(prev => page === 1 ? res.data : [...prev, ...res.data]);
        if (res.data.length < limit) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };
    if (hasMore) loadTouites();
  }, [page, tag, refreshBool]);

  const loadMore = () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  };

  const refresh = () => {
    setRefreshBool(prev => !prev);
    setPage(1);
    setHasMore(true);
  };

  return { touites, hasMore, loading, loadMore, refresh };
}