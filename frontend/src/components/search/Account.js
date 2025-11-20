import TouiteAvatar from "../touite/TouiteAvatar";
import Link from "next/link";

const Account = ({avatar, fullName, username}) => {
  return (
    <article className="p-4 flex space-x-3">
        <TouiteAvatar avatar={avatar} />
        <Link href={`/profile/@${username}`} className="flex items-center space-x-1">
            <span className="font-bold text-[color:var(--foreground)] truncate hover:underline cursor-pointer">
            {fullName}
            </span>
            <span className="text-[color:var(--text-grey)] truncate">@{username}</span>
        </Link>
    </article>
  );
};

export default Account;