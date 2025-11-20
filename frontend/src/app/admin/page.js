"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/home/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ReportsTable from "../../components/admin/ReportsTable";
import { getAllReports } from "@/utils/reportApi";
import { getTouite } from "@/utils/touitesApi";
import { getAccountById } from "@/utils/accountsApi";
import { useLanguage } from "../../components/param/LanguageContext";
import getUserRole from "@/utils/getUserRole";
import ProtectedRoute from "../../utils/ProtectedRoute";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const { t } = useLanguage();
  const role = getUserRole()[0];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const rawReports = await getAllReports();

        const enriched = await Promise.all(
          rawReports.map(async (report) => {
            try {
              const [touite, reporter] = await Promise.all([
                getTouite(report.touiteId),
                getAccountById(report.requesterId),
              ]);

              if (!touite) {
                console.warn(`Touite introuvable pour le report ${report._id}`);
                return null;
              }

              return {
                ...report,
                touiteContent: touite.content,
                touiteAccountId: touite.accountId,
                touiteAuthor: touite.nickname,
                touiteUsername: touite.username,
                touiteDate: touite.createdAt,
                touiteFiles: touite.files || [],
                isAnswer: touite.isAnswerTo,
                reporterName: reporter?.nickname || "Inconnu",
                dateFormatted: report.date
                  ? new Date(report.date).toLocaleString("fr-FR")
                  : "Date inconnue",
              };
            } catch (err) {
              console.error(`Erreur lors du traitement du report ${report._id} :`, err);
              return null;
            }
          })
        );

        const filteredReports = enriched.filter(Boolean);
        setReports(filteredReports);
      } catch (err) {
        console.error("Erreur chargement reports :", err);
      }
    }

    fetchReports();
  }, [loading, role]);

  const unresolvedReports = reports.filter(
    (r) => r.status !== "reportStatusResolved" && r.status !== "reportStatusRejected"
  );
  const resolvedReports = reports.filter(
    (r) => r.status === "reportStatusResolved" || r.status === "reportStatusRejected"
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8 bg-[color:var(--backgroundGray)]">
          <h1 className="text-2xl font-bold">{t("adminDashboard") || "Dashboard d'administration"}</h1>

          <DashboardStats
            stats={{
              unresolved: unresolvedReports.length,
              total: reports.length,
              deleted: resolvedReports.length,
            }}
          />

          <ReportsTable title={t("reportedTouites") || "Touites signalés"} reports={unresolvedReports} setReports={setReports} />
          <ReportsTable title={t("reportsHistory") || "Historique des signalements"} reports={resolvedReports} collapsedByDefault setReports={setReports} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
