"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Touite from "@/components/touite/Touite";
import { getTouite, getTouiteAnswers } from "@/utils/touitesApi";
import useInfiniteTouites from '../../../utils/touitesApi';
import TouiteThread from "@/components/touite/TouiteThread";
import Sidebar from "@/components/home/Sidebar";
import RightSidebar from "@/components/home/RightSidebar";
import TouiteFlow from "@/components/touite/TouiteFlow";
import { useLanguage } from "../../../components/param/LanguageContext";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function TouiteDetailsPage() {
  const { id } = useParams();
  const [current, setCurrent] = useState(null);
  const [parent, setParent] = useState(null);
  const [comments, setComments] = useState([]);
  const { touites, hasMore, loading, loadMore, refresh } = useInfiniteTouites();
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const touite = await getTouite(id);
        setCurrent(touite);

        if (touite.isAnswerTo) {
          const parentTouite = await getTouite(touite.isAnswerTo);
          setParent(parentTouite);
        }

        const replies = await getTouiteAnswers(id);
        setComments(replies);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };

    fetchData();
  }, [id]);

  if (!current) return <div className="text-center p-8">Chargement...</div>;

  return (
    <ProtectedRoute allowedRoles={["admin", "moderator", "user"]}>
      <div className="flex min-h-screen bg-[color:var(--background)]">
        <Sidebar />
        <div className="flex-1 bg-[color:var(--backgroundGray)]">
          <div className="max-w-2xl mx-auto p-4 space-y-6">
            <TouiteThread parent={parent} current={current} />

            <div className="pt-6 space-y-6">
              {comments.length === 0 ? (
                <div className="text-gray-500 text-center">{t("noComment") || "Aucun commentaire."}</div>
              ) : (
                <TouiteFlow touites={comments} onRefresh={refresh} />              
              )}
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </ProtectedRoute>
  );

}
