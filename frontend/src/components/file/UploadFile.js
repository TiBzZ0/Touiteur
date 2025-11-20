"use client";
import { useState } from "react";
import { postFile } from "@/utils/fileApi";

export default function UploadFile({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setError("");
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner une image.");
      return;
    }
    setLoading(true);
    try {
      const data = await postFile(file);
      setLoading(false);
      setFile(null);
      setPreview(null);
      setError("");
      if (onUpload) onUpload(data.file); // callback si besoin
      alert("Image uploadée !");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block"
      />
      {preview && (
        <img
          src={preview}
          alt="Aperçu"
          className="max-h-48 rounded shadow"
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}