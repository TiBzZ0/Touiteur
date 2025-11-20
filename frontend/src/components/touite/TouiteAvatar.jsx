import React from "react";
import { useEffect, useState } from "react";
import { getFileById } from "@/utils/fileApi";
import { FaRegUser } from "react-icons/fa";

const fileUrl = process.env.NODE_ENV === 'production' 
        ? 'https://dev.touiteur.be'
        : 'http://localhost:8080';

export default function TouiteAvatar ({ pictureId }) {

  const [avatar, setAvatar] = useState(null); // Default avatar}

  useEffect(() => {
    if (!pictureId) {
        console.error('Invalid file parameters. Please provide pictureId');
        return;
    }

    getFileById(pictureId)
        .then((response) => {
            if (response) {
                setAvatar(response.url);
            } else {
                console.error('File not found or unsupported format.');
            }
        })
        .catch((error) => {
            console.error('Error fetching file:', error);
        });
}, [pictureId]);

  return (
    avatar? (
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          src={`${fileUrl}${avatar}`}
          alt="User Avatar"
        />
      </div>
    ) : 
    <div className="flex-shrink-0">
      <FaRegUser className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"/>
    </div>
  );
}
