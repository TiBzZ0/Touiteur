"use client"

import Sidebar from "../home/Sidebar"
import RightSidebar from "../home/RightSidebar"

import { getUserByUsername } from "@/utils/accountsApi"
import { getUserProfile } from "@/utils/accountsApi"
import { useState, useEffect } from "react"

import ProfileHeader from "./ProfileHeader"
import ProfileFeedSelector from "./ProfileFeedSelector"

const ProfileLayout = ({ userId }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const decodedId = decodeURIComponent(userId);

            // if userId contains '@', it is a username
            if (decodedId.includes('@')) {
                const profile = await getUserByUsername(decodedId);
                setUserProfile(profile);
            }
            else {
                const profile = await getUserProfile(userId);
                setUserProfile(profile);
            }
        };
        fetchUserProfile();
    }, [userId]);
    return (
        <div className="flex min-h-screen bg-[color:var(--background)]">
            <Sidebar />
            <div className="flex-1">
                <div className="w-full max-w-4xl p-4">
                    <ProfileHeader userProfile={userProfile} setUserProfile={setUserProfile} />
                </div>
                <div className="w-full max-w-4xl p-4">
                    <ProfileFeedSelector userId={userProfile?._id} />
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;
