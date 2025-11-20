"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "@/context/UserContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { userId } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const sendNotification = (notification) => {
    if (socket) {
      console.log("Sending notification:", notification);
      socket.emit("sendNotification", notification);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const s = io(process.env.NODE_ENV === "production"
      ? "https://api.touiteur.be:3000"
      : "http://localhost:3009", { withCredentials: true });
    setSocket(s);
    s.emit("subscribe", userId);
    s.on("notification", notif => {
      setNotifications(n => [notif, ...n]);
    });
    return () => s.disconnect();
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, socket, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}