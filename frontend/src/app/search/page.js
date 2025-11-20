import React from "react";
import ProtectedRoute from "@/utils/ProtectedRoute";

import SearchLayout from "@/components/search/SearchLayout";

export default function searchPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <SearchLayout />
    </ProtectedRoute>
  );
}