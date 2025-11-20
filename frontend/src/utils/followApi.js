import axios from "axios";
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000' // Production API address
  : 'http://localhost:3005/api'; // Local API address for testing



export async function getFollowersCount(userId) {
  try {
    const response = await axios.get(`${API_URL}/follow/${userId}/followers/count`, {
      withCredentials: true 
    });
    return response.data.count;
  } catch (error) {
    console.error("Error fetching followers count:", error);
    throw error;
  }
}

export async function getFollowingCount(userId) {
  try {
    const response = await axios.get(`${API_URL}/follow/${userId}/following/count`, {
      withCredentials: true 
    });
    return response.data.count;
  } catch (error) {
    console.error("Error fetching following count:", error);
    throw error;
  }
}

export async function getIsFollowing(userId, followingId) {
  try {
    const response = await axios.get(`${API_URL}/follow/${userId}/following/${followingId}`, {
      withCredentials: true
    });
    return response.data.isFollowing;
  } catch (error) {
    console.error("Error fetching follow status:", error);
    throw error;
  }
}

export async function followUser(userId, followingId) {
  try {
    const response = await axios.post(`${API_URL}/follow`, { userId, followingId }, {
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

export async function unfollowUser(userId, followingId) {
  try {
    const response = await axios.delete(`${API_URL}/follow`, {
      data: { userId, followingId },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}

export async function getFollowers(userId) {
  try {
    const response = await axios.get(`${API_URL}/follow/${userId}/followers`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

export async function getFollowing(userId) {
  try {
    const response = await axios.get(`${API_URL}/follow/${userId}/following`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
}