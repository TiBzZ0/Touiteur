"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/form/Input";
import ButtonArrow from "@/components/form/ButtonArrow";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Un email de réinitialisation a été envoyé (simulation)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-animated">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/touiter_logo.svg" alt="Touiter Logo" className="w-12 h-12" />
        </div>

        <h2 className="text-2xl font-bold text-center text-[color:var(--color-brand)] mb-6">
          Mot de passe oublié
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ButtonArrow type="submit">Envoyer le lien de réinitialisation</ButtonArrow>
        </form>

        <div className="text-center mt-6">
          <Link href="/auth" className="text-sm text-[color:var(--color-brand)] hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
