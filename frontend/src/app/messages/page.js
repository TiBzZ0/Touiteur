"use client";
import React, { useState } from "react";
import Sidebar from "../../components/home/Sidebar";
import ConversationsList from "../../components/messages/ConversationsList";
import ConversationDetail from "../../components/messages/ConversationDetail";
import NewConversationForm from "@/components/messages/NewConversationForm";
import ProtectedRoute from "../../utils/ProtectedRoute";
import { useLanguage } from "@/components/param/LanguageContext";

export default function FullMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [refreshConversations, setRefreshConversations] = useState(0);
  const [view, setView] = useState("detail");
  const { t } = useLanguage();
  
  const refreshList = () => {
    setRefreshConversations((prev) => prev + 1);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <div className="flex min-h-screen bg-[color:var(--backgroundGray)]">
        <Sidebar />

        <div className="flex flex-1">
          <div className="w-1/3 border-r border-[color:var(--color-brand-background)]">
            <ConversationsList
              selectedConversationId={selectedConversation?.id}
              refreshTrigger={refreshConversations}
              setRefreshTrigger={setRefreshConversations}
              onSelect={(conv) => {
                setSelectedConversation(conv);
                setView("detail");
              }}
              setView={setView}
            />
          </div>

          <div className="flex-1">
            {view === "new" ? (
              <NewConversationForm
                onStart={(group) => {
                  setSelectedConversation(group);
                  setView("detail");
                  setRefreshConversations((prev) => prev + 1);
                }}
                setSelectedConversation={setSelectedConversation}
                setView={setView}
                setRefreshConversations={setRefreshConversations}
              />
            ) : selectedConversation ? (
              <ConversationDetail
                conversation={selectedConversation}
                refreshList={refreshList}
                setSelectedConversation={setSelectedConversation}
                setView={setView}
              />
            ) : (
              <div className="p-8 text-center text-[color:var(--text-grey)] text-lg rounded-lg border border-dashed border-[color:var(--color-brand-background)] bg-[color:var(--background-muted)]">
                {t("selectGroup") || "Sélectionnez une conversation pour commencer à discuter" }
              </div>

            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
