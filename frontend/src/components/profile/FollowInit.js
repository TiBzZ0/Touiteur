import { useEffect, useState } from "react";
import { getFollowersCount, getFollowingCount, getIsFollowing } from "@/utils/followApi";
import FollowHeader from "./FollowHeader";
import { useUser } from "@/context/UserContext";

export default function FollowInit({ userId }) {
  const [initialFollowers, setInitialFollowers] = useState(0);
  const [initialFollowing, setInitialFollowing] = useState(0);
  const [initialIsFollowing, setInitialIsFollowing] = useState(false);
  const { userId: currentUserId } = useUser();

  useEffect(() => {
    async function fetchFollowData() {
      setInitialFollowers(await getFollowersCount(userId));
      setInitialFollowing(await getFollowingCount(userId));
      setInitialIsFollowing(await getIsFollowing(currentUserId, userId));
    }
    if (userId) fetchFollowData();
  }, [userId]);

  return (
    <FollowHeader
        userId={userId}
        initialIsFollowing={initialIsFollowing}
        initialFollowers={initialFollowers}
        initialFollowing={initialFollowing}
    />
  );
}