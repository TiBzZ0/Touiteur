import React, { useEffect, useState } from "react";
import TouiteAvatar from "./TouiteAvatar";
import TouiteHeader from "./TouiteHeader";
import TouiteContent from "./TouiteContent";
import TouiteMedia from "./TouiteMedia";
import TouiteActions from "./TouiteActions";
import { getUserProfile } from "@/utils/accountsApi"
import Link from "next/link";

const Touite = ({accountId, avatar, fullName, username, time, content, media = [], touiteId, stats, onRefresh, clickable, compact = false }) => {
  const [user, setUser] = useState(null);
  const [hovering, setHovering] = useState(false);


  useEffect(() => {
    if (!accountId) return;
    getUserProfile(accountId)
      .then(setUser)
      .catch(() => setUser(null));
  }, [accountId]);

  return (
    <div
      className={`mx-auto ${
        compact ? "text-sm opacity-80" : ""
      } ${
        hovering ? "bg-[color:var(--whiteGray)]" : "bg-[color:var(--background)]"
      } transition-colors duration-150 shadow-[0_0_4px_0_var(--brandDarker)] max-w-xl w-full rounded-lg overflow-hidden`}
    >
      <article className="p-4 flex space-x-3">
        <TouiteAvatar pictureId={user?.pictureId} />
        <div className="flex-1 min-w-0">
          <TouiteHeader fullName={user?.nickname || "Chargement..."} username={user?.username || ""} time={time} touiteId={touiteId} accountId={accountId} onRefresh={onRefresh} />
          {clickable !== false ? (
            <Link href={`/touite/${touiteId}`} className="block"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)} >
              <TouiteContent content={content} />
            </Link>
          ) : (
            <TouiteContent content={content} />
          )}
          {media.length > 0 && <TouiteMedia media={media} />}
          <TouiteActions touiteId={touiteId} stats={stats} accountId={accountId} />
        </div>
      </article>
    </div>
  );
};

export default Touite;
