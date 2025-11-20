"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../param/LanguageContext";
import { getAllAccounts } from "@/utils/accountsApi";
import { createGroup, setLastMessage } from "@/utils/groupApi";
import { sendMessage, markMessageAsRead } from "@/utils/messagesApi";
import { useUser } from "@/context/UserContext";

export default function NewConversationForm({ onStart, setSelectedConversation, setView, setRefreshConversations }) {
    const { t } = useLanguage();
    const [username, setUsername] = useState("");
    const [usernameValid, setUsernameValid] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [conversationName, setConversationName] = useState("");
    const { userId } = useUser();

    useEffect(() => {
        getAllAccounts()
        .then(setAllUsers)
        .catch((err) => {
            console.error("Erreur chargement utilisateurs :", err);
        });
    }, []);

    const handleAddParticipant = () => {
        const cleaned = username.replace(/^@/, "").toLowerCase();
        const found = allUsers.find((u) => u.username.toLowerCase() === cleaned);

        if (found && found._id === userId) return;
        
        if (found && !participants.some((p) => p._id === found._id)) {
            setParticipants((prev) => [...prev, { _id: found._id, username: found.username }]);
            setUsername("");
            setUsernameValid(true);
        }
    };

    const handleRemoveParticipant = (_id) => {
        setParticipants((prev) => prev.filter((p) => p._id !== _id));
    };

    const handleSend = async () => {
        if (participants.length === 0 || newMessage.trim() === "") return;

        let updatedParticipants = [...participants];
        if (!updatedParticipants.some((p) => p._id === userId)) {
            const me = allUsers.find((u) => u._id === userId);
            if (me) {
               updatedParticipants = [{ _id: me._id, username: me.username }, ...updatedParticipants];
            }
        }

        const userIds = updatedParticipants.map((p) => p._id);
        const name =
            conversationName.trim() !== ""
            ? conversationName.trim()
            : updatedParticipants.map((p) => `@${p.username}`).join(", ");

        setLoading(true);
        try {
            const newGroup = await createGroup({
                name,
                usersId: userIds,
            });

            const sendNewMessage = await sendMessage({
                groupId: newGroup.groupId, 
                senderId: userId, 
                content: newMessage
            }); 

            await setLastMessage(newGroup.groupId, sendNewMessage.message._id);
            await markMessageAsRead(sendNewMessage.message._id, userId);

            onStart?.({
                id: newGroup.groupId,
                updatedParticipants,
                firstMessage: newMessage
            });

            setSelectedConversation({
                id: newGroup.groupId,
                name,
            });
            setView("detail");
            setRefreshConversations((prev) => prev + 1);

            setParticipants([]);
            setUsername("");
            setNewMessage("");
            setUsernameValid(true);
        } catch (err) {
            alert(t("sendError") || "Erreur lors de l'envoi");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[color:var(--color-brand-background)] font-bold text-xl">
        {t("newConversation") || "Nouvelle conversation"}
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
            <div>
                <label className="block text-sm mb-1 text-[color:var(--foreground)]">
                    {t("conversationName") || "Nom de la discussion"}
                </label>
                <input
                    type="text"
                    className="w-full bg-[color:var(--color-brand-background)] rounded px-4 py-2 text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] focus:ring-1 focus:outline-none focus:ring-[rgba(139,92,246,0.3)]"
                    placeholder={t("optional") || "Facultatif"}
                    value={conversationName}
                    onChange={(e) => setConversationName(e.target.value)}
                />
            </div>
            <label className="block text-sm mb-1 text-[color:var(--foreground)]">
                {t("recipientUsername") || "Ajouter un destinataire"}
            </label>
            <div className="flex space-x-2">
                <input
                type="text"
                className={`flex-1 bg-[color:var(--color-brand-background)] rounded px-4 py-2 text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] focus:ring-1 focus:outline-none ${
                    usernameValid
                    ? "focus:ring-[rgba(139,92,246,0.3)]"
                    : "border border-red-500 focus:ring-red-300"
                }`}
                placeholder={t("username") || "@utilisateur"}
                value={username}
                onChange={(e) => {
                    const input = e.target.value;
                    setUsername(input);

                    const cleaned = input.replace(/^@/, "").toLowerCase();
                    const exists = allUsers.some((u) => u.username.toLowerCase() === cleaned);
                    setUsernameValid(exists || input.trim() === "");
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && usernameValid && username.trim()) {
                    e.preventDefault();
                    handleAddParticipant();
                    }
                }}
                />
                <button
                onClick={handleAddParticipant}
                disabled={!usernameValid || !username.trim()}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                +
                </button>
            </div>
            {!usernameValid && username.trim() !== "" && (
                <p className="text-sm text-red-600 mt-1">
                {t("invalidUsername") || "Nom d'utilisateur introuvable"}
                </p>
            )}
        </div>

        {participants.length > 0 && (
            <div className="space-y-2">
                <div className="text-sm font-medium text-[color:var(--foreground)]">
                {t("participants") || "Participants"} :
                </div>
                <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
                        <div
                        key={p._id}
                        className="flex items-center bg-[color:var(--color-brand-background)] rounded-full text-sm px-3 py-1"
                        >
                        @{p.username}
                        <button
                            onClick={() => handleRemoveParticipant(p._id)}
                            className="ml-2 text-red-500 hover:text-red-700 font-bold"
                            title={t("remove") || "Supprimer"}
                        >
                            ×
                        </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
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
          disabled={loading || participants.length === 0 || !newMessage.trim()}
          className="bg-[color:var(--color-brand)] text-white font-bold py-2 px-4 rounded-full hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("sending") || "Envoi..." : t("send") || "Envoyer"}
        </button>
      </div>
    </div>
  );
}
