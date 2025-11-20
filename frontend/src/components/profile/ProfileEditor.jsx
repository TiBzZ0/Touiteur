import React, { useState, useEffect } from 'react';
import { setUserProfile } from '@/utils/accountsApi';
import { useUser } from "@/context/UserContext";
import { useLanguage } from "../param/LanguageContext";
import { postFile } from "@/utils/fileApi";

export default function ProfileEditor({ userProfile, onClose }) {

    const { userId } = useUser();
    const { t } = useLanguage(); 

    const [formData, setFormData] = useState({
        username: userProfile.username || '',
        nickname: userProfile.nickname || '',
        bio: userProfile.bio || '',
    });

    useEffect(() => {
        // Update formData when the profile prop changes
        setFormData({
            username: userProfile.username || '',
            nickname: userProfile.nickname || '',
            bio: userProfile.bio || '',
        });
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedPictureId = userProfile.pictureId; // Default to the existing picture ID
    
            // If a new profile picture is selected, upload it
            if (formData.profilePicture instanceof File) {
                const uploadedFile = await postFile(formData.profilePicture);
                updatedPictureId = uploadedFile.file._id; // Use the uploaded file's ID
            }
    
            // Update the user profile with the new picture ID
            const updatedProfileData = {
                ...formData,
                pictureId: updatedPictureId, // Use the updated picture ID
            };
    
            await setUserProfile(userId, updatedProfileData);
            onClose(); // Notify the parent component to re-fetch the profile
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <div className="profile-editor p-5 max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-[color:var(--color-text-gray)]">{t("profilePicture") || "Profile Picture"}</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setFormData({ ...formData, profilePicture: file });
                            }
                        }}
                        className="w-full px-3 py-2 border border-[color:var(--color-brand-dark)] rounded-md bg-transparent text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] focus:border-[color:var(--color-brand)]"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-[color:var(--color-text-gray)]">{t("username") || "Username"}</label>
                    <input
                        type="text"
                        id="name"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[color:var(--color-brand-dark)] rounded-md bg-transparent text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] focus:border-[color:var(--color-brand)]"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-[color:var(--color-text-gray)]">{t("nickname") || "Nickname"}</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[color:var(--color-brand-dark)] rounded-md bg-transparent text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] focus:border-[color:var(--color-brand)]"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-[color:var(--color-text-gray)]">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[color:var(--color-brand-dark)] rounded-md bg-transparent text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] focus:border-[color:var(--color-brand)]"
                    />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 bg-[color:var(--button-gray)] font-bold text-[color:var(--foreground)] rounded-full hover:bg-[color:var(--button-gray-hover)] hover:text-[color:var(--foreground)]"
                    >
                        {t("cancel") || "Cancel"}
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-3 bg-[color:var(--color-brand)] font-bold text-white rounded-full hover:bg-[color:var(--color-brand-dark)]"
                    >
                        {t("save") || "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};
