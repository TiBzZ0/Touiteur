"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { registerUser } from "../../utils/authApi";
import Input from "../form/Input";
import ButtonArrow from "../form/ButtonArrow";
import { useLanguage } from "../param/LanguageContext";

export default function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = (t) => {
    if (!username || !email || !password || !birthdate) {
      return t("requiredFields");
    }

    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      return t("underage");
    }

    if (username.length < 3 || username.length > 20) {
      return t("invalidUsername");
    }

    if (email.length < 3 || email.length > 256) {
      return t("invalidEmailLength");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("invalidEmailFormat");
    }

    if (password.length < 8 || password.length > 128) {
      return t("invalidPassword");
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validateForm(t);
    if (validationError) {
      setError(validationError);
      return;
    }

    const user = {
      username,
      email,
      password,
      birthdate: new Date(birthdate).toISOString(),
      mailText: t("mailText"),
      mailHtml: t("mailHtml"),
      mailSubject: t("mailSubject")
    };

    try {
      const response = await registerUser(user);
      console.log("Inscription réussie :", response);
      setSuccess(true);
      window.location.href = "/auth?verified=pending"; // Redirect to login page with success message
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);

      let errorMessage = "Erreur lors de l'inscription";

      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input type="text" placeholder={t("username")} value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input type="date" label={t("birthdateLabel")} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
      <Input type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} />

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500">
          {t("loginSuccess")}
        </div>
      )}

      <ButtonArrow type="submit">{t("register")}</ButtonArrow>
    </form>
  );
}