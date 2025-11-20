"use client";
import React from "react";
import ConversationDetail from "../../../components/messages/ConversationDetail";

export default function ConversationPage({ params }) {
  const { id } = params; 

  return (
    <div className="flex min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="w-full max-w-2xl mx-auto p-4">
        <ConversationDetail conversationId={id} />
      </div>
    </div>
  );
}
