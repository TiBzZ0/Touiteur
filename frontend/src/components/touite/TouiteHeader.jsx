"use client";

import React, { useState, useRef, useEffect } from "react";
import ReportModal from "./ReportModal";
import { useLanguage } from "../param/LanguageContext";
import DateFormater from "../param/DateFormater";
import { useUser } from "@/context/UserContext";
import { deleteTouite } from "../../utils/touitesApi";
import Link from "next/link";


const TouiteHeader = ({ fullName, username, time, touiteId, accountId, onRefresh }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const menuRef = useRef();
  const { userId } = useUser();

  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDeleteTouite") || "Êtes-vous sûr de vouloir supprimer ce touite ?")) {
      return;
    }
    try {
      await deleteTouite(touiteId);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-1 relative">
      <div className="flex items-baseline space-x-1 text-sm min-w-0">
        <Link href={`/profile/@${username}`} className="flex items-center space-x-1">
          <span className="font-bold text-[color:var(--foreground)] truncate hover:underline cursor-pointer">
            {fullName}
          </span>
          <span className="text-[color:var(--text-grey)] truncate">@{username}</span>
        </Link>
        <span className="text-[color:var(--text-grey)]">·</span>
        <span className="text-[color:var(--text-grey)] hover:underline whitespace-nowrap">
          <DateFormater time={time} />
        </span>
      </div>

      <div ref={menuRef} className="relative">
        <button
          aria-label="More options"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[color:var(--text-grey)] hover:bg-[color:var(--color-brand-background)] rounded-full p-1.5 -mr-1.5"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-[color:var(--color-brand-background)] border border-gray-200 rounded-lg shadow-lg z-10">
            {userId === accountId && (
              <button className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-brand-light)]" onClick={handleDelete}>
                {t("remove")}
              </button>
            )}
            <button
              onClick={() => { 
                setIsReportOpen(true); 
                setMenuOpen(false); 
              }}
              className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-brand-light)]"
            >
              {t("reportSubmit")}
            </button>
          </div>
        )}
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        touiteId={touiteId}
        posterId={accountId}
      />
    </div>
  );
};

export default TouiteHeader;
