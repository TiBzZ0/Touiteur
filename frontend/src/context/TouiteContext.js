"use client";
import React, { createContext, useContext, useState } from "react";

const TouiteContext = createContext();

export function TouiteProvider({ children }) {
  const [touites, setTouites] = useState([]);

  const updateTouite = (updated) => {
    setTouites(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const setAllTouites = (list) => {
    setTouites(list);
  };

  return (
    <TouiteContext.Provider value={{ touites, updateTouite, setAllTouites }}>
      {children}
    </TouiteContext.Provider>
  );
}

export const useTouites = () => useContext(TouiteContext);
