"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../param/LanguageContext";
import { getMessagesByGroupId, sendMessage, markMessageAsRead } from "@/utils/messagesApi";
import { useUser } from "@/context/UserContext";
import { getUserProfile } from "@/utils/accountsApi";
import ManageMembersModal from "./ManageMembersModal";
import { setLastMessage, editGroupName, addUsersToGroup, removeUserFromGroup } from "@/utils/groupApi";
import { CiMenuBurger, CiEdit } from "react-icons/ci";
import { IoPersonAdd, IoClose } from "react-icons/io5";

export default function ConversationDetail({ conversation, refreshList, setSelectedConversation, setView }) {
  const { t } = useLanguage();
  const { userId } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usernames, setUsernames] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [groupName, setGroupName] = useState(conversation?.name || "");
  const [showManageModal, setShowManageModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [localParticipants, setLocalParticipants] = useState(conversation?.participants || []);

  useEffect(() => {
    if (conversation?.name) setGroupName(conversation.name);
  }, [conversation]);

  useEffect(() => {
    if (conversation?.participants) {
      setLocalParticipants(conversation.participants);
    }
  }, [conversation?.participants]);

  useEffect(() => {
    if (!conversation?.id) return;
    getMessagesByGroupId(conversation.id)
      .then(async (msgs) => {
        setMessages(msgs);

        const uniqueSenderIds = [...new Set(msgs.map(m => m.senderId))];
        const usernamesObj = {};
        await Promise.all(uniqueSenderIds.map(async (id) => {
          try {
            const user = await getUserProfile(id);
            usernamesObj[id] = user.username;
          } catch {
            usernamesObj[id] = "?";
          }
        }));
        setUsernames(usernamesObj);
      })
      .catch(() => setMessages([]));
  }, [conversation]);

  const fetchGroupMembers = useCallback(async () => {
    if (!Array.isArray(localParticipants) || localParticipants.length === 0) {
      setGroupMembers([]);
      return;
    }

    try {
      const profiles = await Promise.all(
        localParticipants.map(async (id) => {
          const user = await getUserProfile(id);
          return { _id: user._id, username: user.username };
        })
      );
      setGroupMembers(profiles);
    } catch (err) {
      console.error("Erreur chargement membres :", err);
    }
  }, [localParticipants]);

  useEffect(() => {
    fetchGroupMembers();
  }, [fetchGroupMembers]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !conversation?.id) return;
    try {
      const response = await sendMessage({
        groupId: conversation.id,
        senderId: userId,
        content: newMessage,
      });
      setNewMessage("");

      if (response?.message?._id) {
        await setLastMessage(conversation.id, response.message._id);
        await markMessageAsRead(response.message._id, userId);
      }

      refreshList?.();

      const updatedMessages = await getMessagesByGroupId(conversation.id);
      setMessages(updatedMessages);

      const uniqueSenderIds = [...new Set(updatedMessages.map((m) => m.senderId))];
      const usernamesObj = {};
      await Promise.all(
        uniqueSenderIds.map(async (id) => {
          try {
            const user = await getUserProfile(id);
            usernamesObj[id] = user.username;
          } catch {
            usernamesObj[id] = "?";
          }
        })
      );
      setUsernames(usernamesObj);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    }
  };

  const handleEditGroupName = async (newName) => {
    try {
      await editGroupName(conversation.id, newName);
      setGroupName(newName);
      refreshList?.();
    } catch (err) {
      console.error("Erreur modification nom groupe :", err);
    }
  };

  const handleAddUsers = async (userIds) => {
    try {
      await addUsersToGroup(conversation.id, userIds);
      setLocalParticipants((prev) => [...prev, ...userIds]);
      await fetchGroupMembers();
      refreshList?.();
    } catch (err) {
      console.error("Erreur ajout utilisateurs :", err);
    }
  };

  const handleRemoveUser = async (userIdToRemove) => {
    try {
      await removeUserFromGroup(conversation.id, userIdToRemove);
      setLocalParticipants((prev) => prev.filter((id) => id !== userIdToRemove));
      await fetchGroupMembers();
      refreshList?.();
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setView("list");
  };


  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[color:var(--color-brand-background)] flex justify-between items-center">
        <div className="font-bold text-xl">{groupName || "Conversation"}</div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-xl px-2"
          >
            <CiMenuBurger />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-10 text-sm">
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  const newName = prompt(t("newGroupName") || "Nouveau nom du groupe :");
                  if (newName) handleEditGroupName(newName);
                  setDropdownOpen(false);
                }}
              >
                <CiEdit className="text-lg" /> {t("rename") || "Renommer" }
              </button>

              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  setShowManageModal(true);
                }}
              >
                <IoPersonAdd className="text-lg" /> {t("manageMembers") || "Gérer les membres" }
              </button>

              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => {
                  handleCloseConversation();
                  setDropdownOpen(false);
                }}
              >
                <IoClose className="text-lg" /> {t("closeConversation") || "Fermer la conversation"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-130px)]">
        {messages.map((msg, idx) => {
          const fromMe = msg.senderId === userId;
          const messageDate = new Date(msg.date).toLocaleString();

          return (
            <div
              key={msg._id || idx}
              className={`relative max-w-sm p-3 rounded-lg ${
                fromMe
                  ? "bg-[color:var(--color-brand)] text-white self-end ml-auto"
                  : "bg-[color:var(--color-brand-background)] text-[color:var(--foreground)] self-start mr-auto"
              }`}
            >
              <div className="font-semibold">{usernames[msg.senderId] || "?"}:</div>
              <div>{msg.content}</div>
              <div className={`text-xs text-[color:var(--text-grey)] mt-1 ${fromMe ? "text-right" : "text-left"}`}>
                {messageDate}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[color:var(--color-brand-background)] flex space-x-3">
        <input
          type="text"
          className="flex-1 bg-[color:var(--color-brand-background)] rounded-full px-4 py-2 text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] focus:ring-1 focus:ring-[rgba(139,92,246,0.3)] focus:outline-none"
          placeholder={t("writeMessage") || "Écrire un message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-[color:var(--color-brand)] text-white font-bold py-2 px-4 rounded-full hover:bg-[color:var(--color-brand-dark)]"
        >
          {t("send") || "Envoyer"}
        </button>
      </div>

      {showManageModal && (
        <ManageMembersModal
          existingUsers={groupMembers}
          onClose={() => setShowManageModal(false)}
          onAdd={handleAddUsers}
          onRemove={handleRemoveUser}
          onLeave={(id) => {
            handleRemoveUser(id);
            setShowManageModal(false);
            setSelectedConversation(null);
            setView("list");
          }}
        />
      )}
    </div>
  );
}
