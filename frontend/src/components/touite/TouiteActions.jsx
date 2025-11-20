import React, { useState, useEffect } from "react";
import { FaComment , FaRetweet, FaHeart } from 'react-icons/fa';
import { getLikesCount, addLike, removeLike, hasLike } from "../../utils/likeApi";
import { getTouiteAnswersCount } from "../../utils/touitesApi";
import { useUser } from "@/context/UserContext";
import CommentBox from "./CommentBox"; 
import { useNotifications } from "@/context/NotificationContext";


const TouiteActions = ({ touiteId, stats, accountId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(stats?.likes ?? 0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const { userId, roles } = useUser();
  const { sendNotification } = useNotifications();

  useEffect(() => {
    if (!touiteId) return;
    getLikesCount(touiteId)
      .then(data => setLikeCount(data.count ?? 0))
      .catch(() => setLikeCount(0));
    getTouiteAnswersCount(touiteId)
      .then(count => setCommentCount(count ?? 0))
      .catch(() => setCommentCount(0));
  }, [touiteId]);

  useEffect(() => {
    if (!touiteId || !userId) return;
    hasLike({ userId, touiteId })
      .then(data => {
        setLiked(!!data.hasLike);
      })
      .catch(() => setLiked(false));
  }, [touiteId, userId]);

  const handleLike = async () => {
    if (!touiteId) return;
    if (liked) {
      await removeLike({ userId, touiteId });
      setLikeCount((c) => c - 1);
    } else {
      await addLike({ userId, touiteId });
      setLikeCount((c) => c + 1);
      if (userId !== accountId) {
        console.log("send notification, userId:", userId, "accountId:", accountId);
        sendNotification({ senderId: userId, receiverId: accountId, message: "a aimé votre touite !" });
      }
    }
    setLiked((prev) => !prev);
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-4 text-[color:var(--text-grey)] text-xs sm:text-sm -ml-2">
        <ActionButton 
          icon={<FaComment />} 
          label={commentCount}
          active={showComment}
          color="blue"
          onClick={() => setShowComment((v) => !v)}
        />
        <ActionButton 
          icon={<FaHeart />} 
          label={likeCount} 
          active={liked}
          color="red"
          onClick={handleLike}
        />
      </div>
      {showComment && (
        <div className="mt-2">
          <CommentBox touiteId={touiteId} />
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, active, onClick, color }) => (
  <button
    className={`flex items-center space-x-1 group p-2 rounded-full hover:bg-[color:var(--color-brand-background)] ${
      active && color === "red" ? "text-red-600 hover:text-red-600" : ""
    } ${active && color === "blue" ? "text-[color:var(--color-brand)]" : ""}`}
    onClick={onClick}
    type="button"
  >
    <span>{icon}</span>
    {label !== undefined && <span>{label}</span>}
  </button>
);

export default TouiteActions;