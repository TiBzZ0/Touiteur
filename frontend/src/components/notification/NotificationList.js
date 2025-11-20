"use client";
import { fetchNotifications, deleteNotification } from "@/utils/notificationApi";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/utils/accountsApi";
import Account from "../search/Account";
import { useUser } from "@/context/UserContext";

function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [accounts, setAccounts] = useState({}); // senderId -> account
  const { userId } = useUser();

  useEffect(() => {
    fetchNotifications(userId).then(setNotifications);
  }, [userId]);

  // Récupère les comptes des senderId
  useEffect(() => {
    const uniqueSenderIds = [
      ...new Set(notifications.map(n => n.senderId).filter(Boolean))
    ];
    uniqueSenderIds.forEach(senderId => {
      if (!accounts[senderId]) {
        getUserProfile(senderId).then(profile => {
          setAccounts(prev => ({ ...prev, [senderId]: profile }));
        });
      }
    });
  }, [notifications]);

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(notifications => notifications.filter(n => n._id !== id));
  };

  return (
    <ul>
      {notifications.map(n => (
        <li key={n._id} className="flex items-center space-x-2">
          {accounts[n.senderId] ? (
            <Account {...accounts[n.senderId]} />
          ) : (
            <span>Chargement...</span>
          )}
          <span>{n.message}</span>
          <button onClick={() => handleDelete(n._id)}>delete</button>
        </li>
      ))}
    </ul>
  );
}

export default NotificationList;