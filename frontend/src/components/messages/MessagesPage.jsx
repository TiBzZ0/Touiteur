"use client";
import React from "react";
import ConversationsList from "./ConversationsList";
import ConversationDetail from "./ConversationDetail";

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      
      <div className="w-1/3 border-r border-[color:var(--color-brand-background)]">
        <ConversationsList />
      </div>

      <div className="flex-1">
        <ConversationDetail />
      </div>

    </div>
  );
}
