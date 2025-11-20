"use client";

import React, { useState } from "react";
import { askIA, generateImage } from "../../utils/aiApi";
import FormattedResponse from "./FormattedResponse";

export default function Fryte() {
    const [message, setMessage] = useState("");
    const [reponse, setReponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const handleAsk = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
        const reply = await askIA(message);
        setReponse(reply);
        } catch (error) {
        setReponse("Erreur lors de la requête IA.");
        } finally {
        setLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const url = await generateImage(message);
            setImageUrl(url);
            setReponse("");
        } catch (error) {
            setReponse("Erreur lors de la génération de l'image.");
            setImageUrl("");
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="min-h-screen bg-gradient-animated flex justify-center items-center p-6">
      <div className="bg-[var(--backgroundGray)] dark:bg-[var(--backgroundGray)] rounded-xl shadow-lg max-w-2xl w-full p-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--brand)]">
            Interroge {" "}
            <span
                className="text-4xl text-[var(--brandDark)] italic"
                style={{ fontFamily: '"Palatino Linotype", Palatino, serif' }}>
                FRYTE
            </span>           
        </h1>


        <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Écris ta question..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                    e.preventDefault();
                    handleAsk();
                    }
                }}
                className="
                w-full px-4 py-3 rounded-lg border border-[var(--button-gray)] focus:outline-none
                focus:ring-2 focus:ring-[var(--brand)] bg-[var(--background)] text-[var(--foreground)]
                placeholder-[var(--text-gray)]
                "
            />

            <button
                onClick={handleAsk}
                className="
                w-full py-3 rounded-lg bg-[var(--brand)]
                hover:bg-[var(--brandDark)] transition-colors duration-300
                text-white font-semibold animated-shadow
                disabled:opacity-50 disabled:cursor-not-allowed
                "
                disabled={loading}
            >
                {loading ? "Chargement..." : "Envoyer"}
            </button>

            <button
                onClick={handleGenerateImage}
                className="
                    w-full py-3 rounded-lg bg-[var(--brandLight)]
                    hover:bg-[var(--brandDark)] transition-colors duration-300
                    text-white font-semibold animated-shadow
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
                disabled={loading}
                >
                {loading ? "Chargement..." : "Générer une image"}
            </button>

            {reponse && (
                <div className="
                    mt-6 bg-[var(--brandBackground)] p-4 rounded-lg
                    text-[var(--foreground)] animate-fade-in
                ">
                    <h2 className="text-lg font-semibold text-[var(--brandDark)] mb-2">
                    Réponse de{" "}
                    <span
                        className="text-[var(--brandDark)] italic"
                        style={{ fontFamily: '"Palatino Linotype", Palatino, serif' }}>
                        FRYTE :
                    </span>
                    </h2>
                    <FormattedResponse text={reponse} />
                </div>
            )}
            {imageUrl && (
                <div className="mt-6 flex justify-center animate-fade-in">
                    <img
                    src={imageUrl}
                    alt="Image générée par l'IA"
                    className="rounded-lg shadow-lg max-h-[500px]"
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
