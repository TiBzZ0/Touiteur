"use client";
import { useState, useEffect } from "react";
import { followUser, unfollowUser} from "@/utils/followApi";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";

export default function FollowHeader({ userId, initialIsFollowing, initialFollowers, initialFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { userId: currentUserId } = useUser();
  const { sendNotification } = useNotifications();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
    setFollowers(initialFollowers);
    setFollowing(initialFollowing);
  }, [initialIsFollowing, initialFollowers, initialFollowing]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, userId);
        setIsFollowing(false);
        setFollowers(f => f - 1);
      } else {
        await followUser(currentUserId, userId);
        setIsFollowing(true);
        setFollowers(f => f + 1);
        sendNotification({senderId: currentUserId, receiverId: userId, message: "a commencé à vous suivre !"});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 justify-end w-full">
      <div>
        <span className="font-bold">{followers}</span> Followers
      </div>
      <div>
        <span className="font-bold">{following}</span> Following
      </div>
      {currentUserId !== userId ? (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-full font-semibold ${
            isFollowing ? "bg-gray-200 text-gray-700" : "bg-blue-500 text-white"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      ) : null}
    </div>
  );
}