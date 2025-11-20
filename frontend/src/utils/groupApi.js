import axios from "axios";
const API_URL = process.env.NODE_ENV === "production"
  ? 'https://api.touiteur.be:3000/groups' // Production API address
  : 'http://localhost:3002/api/groups';

export async function createGroup({ name, usersId, message }) {
  try {
    const res = await axios.post(
      `${API_URL}/`,
      { name, usersId, message },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserGroups(userId) {
  try {
    const res = await axios.get(
      `${API_URL}/user/${userId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function setLastMessage(groupId, messageId) {
  try {
    const res = await axios.post(
      `${API_URL}/${groupId}/last-message`,
      { messageId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function addUsersToGroup(groupId, userIds) {
  try {
    console.log("groupeAPI:",userIds);
    const res = await axios.post(
      `${API_URL}/${groupId}/users`,
      { userIds },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function removeUserFromGroup(groupId, userId) {
  try {
    const res = await axios.delete(
      `${API_URL}/${groupId}/users/${userId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function editGroupName(groupId, name) {
  try {
    const res = await axios.put(
      `${API_URL}/${groupId}/name`,
      { name },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
