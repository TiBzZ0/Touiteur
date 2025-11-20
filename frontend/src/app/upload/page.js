"use client";
import React from "react";
import UploadFile from "@/components/file/UploadFile";
import ProtectedRoute from "@/utils/ProtectedRoute";

export default function profilePage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <UploadFile onUpload={(file) => console.log("Uploaded file:", file)} />
    </ProtectedRoute>
  );
}