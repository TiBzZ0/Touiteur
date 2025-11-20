import React, { useState, useEffect } from "react";
import { useLanguage } from "../param/LanguageContext";
import { getAllReportReasons, createReport } from "../../utils/reportApi";
import { useUser } from "@/context/UserContext";

export default function ReportModal({ isOpen, onClose, touiteId, posterId }) {
  const { t } = useLanguage();

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [reportReasons, setReportReasons] = useState([]);
  const { userId: requesterId } = useUser();

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setComment("");
      setErrors({});
      getAllReportReasons()
        .then(setReportReasons)
        .catch((err) => console.error("Erreur chargement motifs :", err));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!reason) newErrors.reason = t("reportReasonError");
    if (comment.length > 255) newErrors.comment = t("reportCommentError");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createReport({
        touiteId,
        posterId,
        requesterId,
        comment,
        reason,
      });

      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du signalement :", err);
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setComment(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[color:var(--background)]/30 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg" onClick={onClose}>
      <div className="bg-[color:var(--color-whitegray)] p-6 rounded-lg w-full max-w-md shadow-[0_0_16px_0_var(--brandDarker)]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t("reportTitle")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t("reportReasonLabel")}</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full border rounded px-3 py-2 bg-[color:var(--color-whitegray)] text-[color:var(--color-brand)] ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">{t("reportSelectPlaceholder")}</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {t(reason)}
                </option>
              ))}
            </select>
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">{t("reportCommentLabel")}</label>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className={`w-full border rounded px-3 py-2 ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
              rows="4"
            ></textarea>
            <div className="text-sm text-gray-500 text-right">
              {comment.length} / 255
            </div>
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-460"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("reportSubmit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
