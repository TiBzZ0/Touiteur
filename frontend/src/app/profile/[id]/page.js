import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProtectedRoute from "@/utils/ProtectedRoute";

export default function profilePage({ params }) {
  const { id } = React.use(params);
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <ProfileLayout userId={id} />
    </ProtectedRoute>
  );
}