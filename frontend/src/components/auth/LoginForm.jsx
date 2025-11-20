"use client"; 

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Input from "../form/Input";
import ButtonArrow from "../form/ButtonArrow";
import { useLanguage } from "../param/LanguageContext";
import { loginUser } from "../../utils/authApi";
import { useUser } from "@/context/UserContext";

export default function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername || !password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const credentials = {
      emailOrUsername,
      password
    };

    try {
      const response = await loginUser(credentials);

      if (!response) {
        setError("Aucun token reçu. Veuillez réessayer.");
        return;
      }

      setUser({
        id: response.account.id,
        roles: Array.isArray(response.account.role) ? response.account.role : [response.account.role],
        username: response.account.username
      });

      router.push("/home");
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      let errorMessage = "Erreur lors de la connexion";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder={t("emailOrUsername")}
        id={"emailOrUsername"}
        name={"emailOrUsername"}
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder={t("password")}
        id={"password"}
        name={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-[color:var(--color-brand)] hover:underline">
          {t("forgotPassword")}
        </Link>
      </div>
      {verified === "true" && (
        <div className="text-green-500">
          {t("accountVerified")}
        </div>
      )}
      {verified === "false" && (
        <div className="text-red-500">
          {t("accountVerifiedError")}
        </div>
      )}
      {verified === "pending" && (
        <div className="text-blue-500">
          {t("accountNotVerified")}
        </div>
      )}

      <ButtonArrow type="submit">{t("login")}</ButtonArrow>
    </form>
  );
}
