import axios from "axios";

const API_URL = process.env.NODE_ENV === "production"
  ? "https://api.touiteur.be:3000"
  : "http://localhost:3009/api";

export async function fetchNotifications(userId) {
  const res = await axios.get(`${API_URL}/notifications/${userId}`, { withCredentials: true });
  return res.data.notifications;
}

export async function deleteNotification(userId) {
  await axios.delete(`${API_URL}/notifications/${userId}`, { withCredentials: true });
}