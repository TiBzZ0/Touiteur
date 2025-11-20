"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../param/LanguageContext";
import { RiQuillPenAiLine } from "react-icons/ri";
import { getUserGroups } from "@/utils/groupApi";
import { useUser } from "@/context/UserContext";
import { getMessages, hasUnread, markGroupMessagesAsRead } from "@/utils/messagesApi";

export default function ConversationsList({ onSelect, refreshTrigger, setRefreshTrigger, setView, selectedConversationId }) {
  const { t } = useLanguage();
  const { userId } = useUser();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchGroups = async () => {
      try {
        const data = await getUserGroups(userId);
        const groupsData = data.groups || data;

        const apiGroups = await Promise.all(
          groupsData.map(async (g) => {
            let lastMessageContent = "";
            let lastMessageDate = null;
            let hasUnreadFlag = false;

            try {
              const message = await getMessages(g.lastMessageId);
              if (message && message.content) {
                lastMessageContent = message.content;
                lastMessageDate = new Date(message.date);
              }

              const unreadResponse = await hasUnread(g._id, userId);
              hasUnreadFlag = unreadResponse?.hasUnread || false;
            } catch (e) {
              console.error("Error in message fetch:", e);
            }

            return {
              id: g._id,
              name: g.name,
              participants: g.usersId || [],
              lastMessage: lastMessageContent,
              lastMessageDate,
              hasUnread: hasUnreadFlag,
            };
          })
        );

        const sortedGroups = apiGroups.sort((a, b) => {
          if (!a.lastMessageDate) return 1;
          if (!b.lastMessageDate) return -1;
          return b.lastMessageDate - a.lastMessageDate;
        });

        setGroups(sortedGroups);
      } catch (err) {
        console.error("Erreur chargement groupes :", err);
      }
    };

    fetchGroups();
  }, [userId, refreshTrigger]);

  const handleNewConversation = () => {
    setView("new");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t("messages") || "Messages"}</h2>
        <button 
          onClick={handleNewConversation}
          className="bg-[color:var(--color-brand)] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-[color:var(--color-brand-dark)] transition-all duration-300 flex items-center space-x-2"
        >
          <RiQuillPenAiLine size={16} />
          <span>{t("new") || "Nouveau"}</span>
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-90px)] pr-2">
        {groups.map((conv) => {
          const isSelected = conv.id === selectedConversationId;

          return (
            <div 
              key={conv.id}
              className={`p-3 rounded-md cursor-pointer transition ${
                isSelected
                  ? "bg-[color:var(--color-brand)] text-white"
                  : "bg-[color:var(--color-brand-background)] hover:bg-[color:var(--color-brand)] hover:text-white"
              }`}
              onClick={async () => {
                try {
                  await markGroupMessagesAsRead(conv.id, userId);
                  setRefreshTrigger((prev) => prev + 1);
                  onSelect(conv);
                  setView("detail");
                } catch (err) {
                  console.error("Erreur marquage messages comme lus :", err);
                }
              }}
            >
              <div className="font-semibold flex justify-between items-center">
                {conv.name}
                {conv.hasUnread && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    ●
                  </span>
                )}
              </div>
              <div className="text-sm text-[color:var(--text-grey)]">{conv.lastMessage}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
