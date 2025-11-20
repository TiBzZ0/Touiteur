import React, { useEffect, useState } from "react";
import { getAllAccounts } from "@/utils/accountsApi";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "../param/LanguageContext";

export default function ManageMembersModal({ onClose, onAdd, onRemove, onLeave, existingUsers = [] }) {
  const { userId } = useUser();
  const [allUsers, setAllUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [currentMembers, setCurrentMembers] = useState(existingUsers);
  const { t } = useLanguage();
  
  useEffect(() => {
    getAllAccounts()
      .then(setAllUsers)
      .catch((err) => console.error("Erreur chargement utilisateurs :", err));
  }, []);

  const handleAdd = () => {
    const cleaned = username.replace(/^@/, "").toLowerCase();
    const found = allUsers.find((u) => u.username.toLowerCase() === cleaned);

    if (
      found &&
      !currentMembers.some((m) => m._id === found._id)
    ) {
      setCurrentMembers((prev) => [...prev, found]);
      onAdd([found._id]);
      setUsername("");
      setUsernameValid(true);
    }
  };

  const handleRemove = (id) => {
    setCurrentMembers((prev) => prev.filter((m) => m._id !== id));
    onRemove(id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">{t("manageMembers") || "Gérer les membres"}</h2>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {currentMembers.map((member) => (
            <div key={member._id} className="flex items-center justify-between bg-gray-100 rounded px-4 py-2 text-sm">
              @{member.username}
              {member._id !== userId && (
                <button
                  onClick={() => handleRemove(member._id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  title={t("remove") || "Supprimer"}
                >
                  −
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <input
            type="text"
            className={`flex-1 border px-4 py-2 rounded focus:outline-none ${
              usernameValid ? "border-gray-300" : "border-red-500"
            }`}
            placeholder={t("usernameToAdd") || "@utilisateur à ajouter" }
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
                handleAdd();
              }
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!usernameValid || !username.trim()}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          >
            +
          </button>
        </div>
        {!usernameValid && username.trim() !== "" && (
          <p className="text-sm text-red-600">{t("userNotFound") || "Utilisateur introuvable."}</p>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={() => {
              onLeave(userId);
              onClose();
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            {t("leaveGroup") || "Quitter le groupe"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              {t("close") || "Fermer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
