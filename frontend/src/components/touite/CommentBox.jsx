import React, { useState } from "react";
import { useLanguage } from "../param/LanguageContext";
import { useUser } from "../../context/UserContext";
import { postTouiteAnswer } from "../../utils/touitesApi";

const CommentBox = ({ touiteId, onPost }) => {
    const { t } = useLanguage();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { userId } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !touiteId || !userId) return;
        setLoading(true);
        try {
            await postTouiteAnswer({
                touiteId,
                content: comment,
                accountId: userId,
            });
            setComment("");
            if (onPost) onPost();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2">
            <textarea
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] resize-none"
                placeholder={t("comment") || "Votre commentaire..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={loading}
                rows={2}
            />
            <button
                type="submit"
                className="bg-[color:var(--color-brand)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[color:var(--color-brand-dark)]"
                disabled={loading}
            >
                {t("touite") || "Touiter"}
            </button>
        </form>
    );
};

export default CommentBox;