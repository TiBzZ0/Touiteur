"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

function getUserFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)user=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(undefined);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      setUserId(user.id);
      setRoles(Array.isArray(user.role) ? user.role : [user.role]);
    } else {
      setUserId(null);
      setRoles([]);
    }
  }, []);

  const setUser = ({ id, roles }) => {
    setUserId(id);
    setRoles(roles);
    document.cookie = `user=${encodeURIComponent(JSON.stringify({ id, role: roles }))}; path=/; max-age=${6 * 60 * 60}`;
  };

  const logout = () => {
    setUserId(null);
    setRoles([]);
    document.cookie = "user=; path=/; max-age=0";
  };

  return (
    <UserContext.Provider value={{ userId, roles, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}