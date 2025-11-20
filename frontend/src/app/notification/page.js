
import React from "react";
import NotificationLayout from "@/components/notification/NotificationLayout";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { useUser } from "@/context/UserContext";

export default function profilePage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <NotificationLayout />
    </ProtectedRoute>
  );
}