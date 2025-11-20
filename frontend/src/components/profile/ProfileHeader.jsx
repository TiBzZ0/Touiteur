import React, { useState } from "react";
import { useLanguage } from "../param/LanguageContext"; // Import the language context
import { getUserProfile } from "@/utils/accountsApi"; // Import the API function to fetch the profile
import TouiteAvatar from "../touite/TouiteAvatar"; // Import the avatar component
import BioField from "./BioField"; // Import the bio field component
import ProfileEditor from "./ProfileEditor"; // Import the profile editor component
import FollowInit from "./FollowInit"; // Import the follow initialization component
import { useUser } from "@/context/UserContext"; // Import the user context

export default function ProfileHeader({ userProfile, setUserProfile }) {
    const { t } = useLanguage();

    const [isEditing, setIsEditing] = useState(false);

    const { userId: userId } = useUser(); // Get the current user's ID from the context

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const fetchUserProfile = async () => {
        try {
            const updatedProfile = await getUserProfile(userProfile._id); // Fetch the updated profile
            setUserProfile(updatedProfile); // Update the profile in the parent state
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const handleProfileUpdate = () => {
        setIsEditing(false);
        fetchUserProfile(); // Re-fetch the updated profile after editing
    };

    return (
        <div className="mt-4 w-full flex justify-center">
            <div className="p-4 rounded-md animated-shadow w-full max-w-4xl bg-[color:var(--card-background)] mx-4">
                <div className="space-x-4 flex items-center">
                    <TouiteAvatar pictureId={userProfile?.pictureId} />
                    <div className="flex flex-col">
                        <p className="text-[color:var(--foreground)] text-xl sm:text-2xl font-bold">
                            {userProfile?.nickname || "Loading..."}
                        </p>
                        <p className="text-[color:var(--foreground)] text-lg sm:text-xl italic">
                            @{userProfile?.username || "Loading..."}
                        </p>
                    </div> 
                    {userProfile?._id === userId ? (
                            <button
                        className="ml-auto mt-auto mb-auto px-5 py-3 bg-[color:var(--color-brand)] font-bold text-white rounded-full hover:bg-[color:var(--color-brand-dark)] flex-justify-center items-center"
                        onClick={handleEditProfile}
                    >{t("edit") || "Edit"}</button>
                        )
                    : null}
                </div>
                {isEditing ? (
                    <ProfileEditor userProfile={userProfile} onClose={handleProfileUpdate} />
                ) : (
                    <BioField content={userProfile?.bio} />
                )}
                <FollowInit userId={userProfile?._id} />
            </div>
        </div>
    );
}