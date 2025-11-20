"use client";
import React from "react";

export default function SidebarLink({ icon, label, link = "#" }) {
  return (
    <a
      href={link}
      className="flex items-center space-x-3 text-xl font-medium text-[color:var(--foreground)] hover:bg-[color:var(--color-brand-background)] rounded px-4 py-2"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
