"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useLanguage } from "../param/LanguageContext";
import SettingsMenu from "../param/SettingsMenu";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [parent] = useAutoAnimate();

  const brand = "#7C3AED";

  return (
    <div className="bg-[color:var(--color-background)] p-8 rounded-2xl shadow-md w-full max-w-md relative">
      {/* Touiter logo */}
      <div className="flex justify-center mb-8">
        <img src="/touiter_logo.svg" alt="Touiter Logo" className="w-12 h-12" />
      </div>

      {/* Login/Register tabs */}
      <div className="flex justify-center mb-6 space-x-8">
        <button
          onClick={() => setActiveTab("login")}
          className={`text-lg font-semibold pb-2 ${activeTab === "login" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "login" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          {t("login")}
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`text-lg font-semibold pb-2 ${activeTab === "register" ? "" : "text-[color:var(--text-grey)]"}`}
          style={activeTab === "register" ? { color: brand, borderBottom: `2px solid ${brand}` } : {}}
        >
          {t("register")}
        </button>
      </div>

      {/* Forms */}
      <div ref={parent}>
        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
