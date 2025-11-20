"use client";

import React, { useState } from "react";
import { askIA } from "../../utils/aiApi";
import Sidebar from "../../components/home/Sidebar";
import Fryte from "../../components/fryte/Fryte"
import { TouiteProvider } from "../../context/TouiteContext";
import ProtectedRoute from "../../utils/ProtectedRoute";

export default function PageIA() {
  const [message, setMessage] = useState("");
  const [reponse, setReponse] = useState("");

  const handleAsk = async () => {
    const reply = await askIA(message);
    setReponse(reply);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
          <div className="flex min-h-screen bg-[color:var(--background)]">
            <Sidebar />
            <div className="flex-1">
              <TouiteProvider>
                <Fryte />
              </TouiteProvider>
            </div>
          </div>
    </ProtectedRoute>
  );
}
