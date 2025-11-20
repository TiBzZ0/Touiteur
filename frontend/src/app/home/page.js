"use client";
import React from "react";
import Sidebar from "../../components/home/Sidebar";
import Feed from "@/components/home/Feed";
import RightSidebar from "../../components/home/RightSidebar";
import { TouiteProvider } from "../../context/TouiteContext";
import ProtectedRoute from "../../utils/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <div className="flex min-h-screen bg-[color:var(--background)]">
        <Sidebar />
        <div className="flex-1">
          <TouiteProvider>
            <Feed />
          </TouiteProvider>
        </div>
      </div>
    </ProtectedRoute>
  );
}
