"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../param/LanguageContext";
import Touite from "@/components/touite/Touite";
import Link from "next/link";
import { getAllReportStatus, updateReportStatus } from "../../utils/reportApi";
import { deleteTouite } from "@/utils/touitesApi";
import { banUserTemporarily } from "@/utils/accountsApi";
import { useUser } from "@/context/UserContext";

export default function ReportsTable({ title, reports, setReports, collapsedByDefault = false }) {
  const [openId, setOpenId] = useState(null);
  const [collapsed, setCollapsed] = useState(collapsedByDefault);
  const [reportStatus, setReportStatus] = useState([]);
  const [banUntil, setBanUntil] = useState({});
  const { userId } = useUser();
  const { t } = useLanguage();

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    getAllReportStatus()
      .then(setReportStatus)
      .catch((err) => console.error("Erreur chargement statuts :", err));
  }, []);

  const handleStatusChange = async (report, e) => {
    const newStatus = e.target.value;
    try {
      await updateReportStatus(report._id, newStatus, userId);

      setReports((prevReports) =>
        prevReports.map((r) =>
          r._id === report._id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("Erreur update statut :", error);
    }
  };


  const handleBan = async (accountId) => {
    const until = banUntil[accountId];
    if (!until) return alert(t("chooseBanDate") || "Veuillez choisir une date de fin de bannissement.");
    const selectedDate = new Date(until);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return alert(t("banDateInFuture") || "La date de fin de bannissement doit être dans le futur.");
    }

    try {
      await banUserTemporarily(accountId, until);
      alert(t("bannedUntil") + until || "Utilisateur banni jusqu'au " + until);
    } catch (err) {
      console.error("Erreur ban:", err);
    }
  };

  const deleteTouiteBtn = async (touiteId) => {
    try {
      await deleteTouite(touiteId);
      alert(t("touiteDeleted") || "Touite supprimé avec succès !");
      setReports((prevReports) => prevReports.filter(r => r.touiteId !== touiteId));
    } catch (error) {
      console.error("Erreur lors de la suppression du touite :", error);
      alert(t("deleteError") || "Erreur lors de la suppression du touite.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="text-sm text-[color:var(--color-brand)] hover:underline"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? t("show") || "Afficher" : t("hide") || "Masquer"}
        </button>
      </div>

      {!collapsed && (
        <div className="overflow-x-auto rounded-xl border border-[color:var(--color-brand-background)] shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[color:var(--color-brand-dark)] text-[color:var(--text-grey)] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Touite</th>
                <th className="px-6 py-3">{t("isAnAnswer") || "Est une réponse"}</th>
                <th className="px-6 py-3">{t("status") || "Statut"}</th>
                <th className="px-6 py-3">{t("updateStatus") || "Modifier le statut"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-brand-background)]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {t("emptyTable") || "Aucun rapport à afficher"}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                <React.Fragment key={report._id}>
                  <tr
                    onClick={() => toggleOpen(report._id)}
                    className="cursor-pointer hover:bg-[color:var(--color-brand-background)] transition"
                  >
                    <td className="px-6 py-4 font-medium">{report._id}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/touite/${report.touiteId}`}
                        className="block transform transition-transform duration-150 hover:scale-[1.015] pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="pointer-events-none">
                          <Touite
                            accountId={report.touiteAccountId}
                            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                            fullName={report.touiteAuthor}
                            username={report.touiteUsername}
                            time={report.touiteDate}
                            content={report.touiteContent}
                            media={report.touiteFiles || []}
                            touiteId={report.touiteId}
                            stats={{ retweets: 0 }}
                            clickable={false}
                            compact={false}
                          />
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {report.isAnswerTo == null ? t("false") || "Faux" : t("true") || "Vrai"}
                    </td>
                    <td className="px-6 py-4 capitalize">{t(report.status) || report.status}</td>
                    <td className="px-6 py-4">
                      <select
                        name="updateStatus"
                        id="updateStatus"
                        className="px-3 py-2 bg-transparent focus:bg-[color:var(--color-whitegray)] transition-colors rounded"
                        value={report.status}
                        onChange={(e) => handleStatusChange(report, e)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {reportStatus.map((status) => (
                          <option key={status} value={status}>
                            {t(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {openId === report._id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-[color:var(--color-brand-light)] rounded-b-lg">
                        <div className="text-sm space-y-2">

                          <div className="flex justify-between items-center">
                            <p><strong>{t("reason") || "Motif"} :</strong> {t(report.reason)}</p>
                            <button
                              onClick={() => deleteTouiteBtn(report.touiteId)}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              {t("remove")}
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            <p><strong>{t("comment") || "Commentaire"} :</strong> {report.comment || "(aucun)"}</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={banUntil[report.touiteAccountId] || ""}
                                onChange={(e) =>
                                  setBanUntil({ ...banUntil, [report.touiteAccountId]: e.target.value })
                                }
                                className="border px-2 py-1 rounded"
                              />
                              <button
                                onClick={() => handleBan(report.touiteAccountId)}
                                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-600"
                              >
                                {t("banUntil")}
                              </button>
                            </div>
                          </div>

                          <p><strong>{t("date") || "Date"} :</strong> {report.dateFormatted}</p>
                          <p><strong>{t("reportedBy") || "Signalé par"} :</strong> {report.reporterName}</p>

                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => setOpenId(null)}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-full"
                            >
                              {t("close") || "Fermer"}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
