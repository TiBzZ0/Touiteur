"use client";
import React from "react";
import { useLanguage } from "../param/LanguageContext";

export default function DashboardStats({ stats }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label={t("unresolvedReports") || "Signalements non traités"} value={stats.unresolved} />
      <StatCard label={t("totalReports") || "Signalements totaux"} value={stats.total} />
      <StatCard label={t("resolvedTouites") || "Touites traités"} value={stats.deleted} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[color:var(--background)] p-6 rounded-xl animated-shadow">
      <h2 className="text-sm text-[color:var(--text-grey)]">{label}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
