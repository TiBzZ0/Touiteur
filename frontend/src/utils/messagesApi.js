import axios from "axios";

const API_URL = process.env.NODE_ENV === "production"
  ? 'https://api.touiteur.be:3000/messages' // Production API address
  : 'http://localhost:3003/api/messages';

export async function sendMessage({ groupId, senderId, content }) {
  try {
    const res = await axios.post(
      `${API_URL}/send`,
      { groupId, senderId, content },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getMessages(messageId) {
  try {
    const res = await axios.get(
      `${API_URL}/${messageId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getMessagesByGroupId(groupId) {
  try {
    const res = await axios.get(
      `${API_URL}/group/${groupId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function hasUnread(groupId, userId) {
  try {
    const res = await axios.post(
      `${API_URL}/${groupId}/has-unread/${userId}`, 
      {},
      { withCredentials: true }
    )
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function markMessageAsRead(messageId, readerId) {
  try {
    const res = await axios.post(`${API_URL}/read/${messageId}`,{
      readerId,
    }, { withCredentials: true } );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function markGroupMessagesAsRead(groupId, userId) {
  try {
    const res = await axios.post(`${API_URL}/${groupId}/mark-all-read/${userId}`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
}
