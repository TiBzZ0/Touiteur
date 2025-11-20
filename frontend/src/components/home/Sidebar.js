"use client";
import React, {useEffect, useState, useContext} from "react";
import {
  FaHome,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUser,
  FaEllipsisH,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { AiFillOpenAI } from "react-icons/ai";
import { useLanguage } from "../param/LanguageContext";
import SidebarLink from "./SidebarLink";
import Param from "../param/SettingsMenu"
import getUserRole from "@/utils/getUserRole";
import { getUserProfile } from "@/utils/accountsApi";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/utils/authApi";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";


export default function Sidebar() {
  const { t } = useLanguage();
  const role = getUserRole()[0];
  const [user, setUser] = useState(null);
  const { userId } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    getUserProfile(userId)
      .then(setUser)
      .catch(() => setUser(null));
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/auth"); 
    } catch (error) {
      console.log("Erreur lors de la déconnexion", error);
    }
  };

  const { notifications } = useNotifications();
  console.log("Notifications dans Sidebar :", notifications);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="w-64 h-screen sticky top-0 p-4 flex flex-col justify-between bg-[color:var(--background)] shadow-[4px_0_6px_-4px_var(--brandDarker)]">
      <div>
        <div className="text-2xl font-bold mb-8 text-[color:var(--foreground)]">
          <div className="flex justify-center mb-8">
            <a href="/home">
              <img src="/touiter_logo.svg" alt="Touiter Logo" className="w-12 h-12 cursor-pointer" />
            </a>
          </div>
        </div>
        <nav className="flex flex-col space-y-3">
          <SidebarLink icon={<FaHome />} label={t("home") || "Accueil"} link="/home" />
          <SidebarLink icon={<FaSearch />} label={t("explore") || "Explorer"} link="/search"/>
          <SidebarLink icon={<FaBell />} label={`${t("notifications") || "Notifications"} ${notifications.length}`} link="/notification" />
          <SidebarLink icon={<FaEnvelope />} label={t("messages") || "Messages"} link="/messages" />
          <SidebarLink icon={<FaUser />} label={t("profile") || "Profil"} link={`/profile/${userId}`} />
          {role === "admin" && (
            <SidebarLink
            icon={<MdAdminPanelSettings />}
            label={t("admin") || "Administration"}
            link="/admin"
            />
          )}
          <SidebarLink icon={<AiFillOpenAI  />} label="Fryte" link="/ai" />
          <div onClick={toggleSettingsMenu} className="cursor-pointer">
            <SidebarLink icon={<FaEllipsisH />} label={t("more") || "Plus"} />
          </div>
          {isSettingsOpen && <Param />}
        </nav>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[color:var(--text-grey)] rounded-full"></div>
          <div>
            <div className="font-semibold text-[color:var(--foreground)]">
              {user?.nickname || t("usernameDisplay")}
            </div>
            <div className="text-sm text-[color:var(--text-grey)]">
              @{user?.username || t("handle")}
            </div>
          </div>
        </div>
        <div className="p-3 text-[color:var(--text-grey)] cursor-pointer hover:text-red-500" onClick={handleLogout}>
          <FaSignOutAlt />
        </div>
      </div>
    </div>
  );
}
