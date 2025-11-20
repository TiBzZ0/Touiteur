import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000/files'
  : 'http://localhost:3008/api/files';

export async function postFile(file) {
  const formData = new FormData();
  formData.append("file", file);
    try {
    const res = await axios.post(API_URL+ '/upload', formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    throw new Error("Erreur lors de l'upload du fichier");
  }
}

export async function getFileByUuid(uuid) {
  try {
    const res = await axios.get(`${API_URL}/${uuid}`, {
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching file:", err.response || err.message);
    throw new Error("Erreur lors de la récupération du fichier");
  }
}

export async function getFileById(id) {
  try {
    const res = await axios.get(`${API_URL}/id/${id}`, {
      withCredentials: true 
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching file by ID:", err.response || err.message);
    throw new Error("Erreur lors de la récupération du fichier par ID");
  }
}