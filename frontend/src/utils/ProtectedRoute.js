"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import getUserRole from "@/utils/getUserRole";
import { useEffect, useState } from "react";
import { useLanguage } from "../components/param/LanguageContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(undefined);
  const { t } = useLanguage();

  useEffect(() => {
    if (userId === undefined) return; // attente du contexte
    const r = getUserRole()[0];
    setRole(r);
  }, [userId]);

  useEffect(() => {
    if (userId === undefined || role === undefined) return; // attente

    if (userId === null) {
      router.replace("/auth");
      return;
    }

    if (
      allowedRoles &&
      Array.isArray(allowedRoles) &&
      !allowedRoles.includes(role)
    ) {
      router.replace("/home");
    } else {
      setLoading(false);
    }
  }, [userId, role, allowedRoles, router]);

  if (loading) return <div>{t("loading") || "Chargement..."}</div>;

  return children;
}