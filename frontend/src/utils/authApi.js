import axios from "axios";
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000' // Production API address
  : 'http://localhost:3002/api/auth'; // Local API address for testing

export async function registerUser(user) {
  const response = await axios.post(''+API_URL+'/register', user);
  return response.data;
}

export async function loginUser(credentials) {
  const { emailOrUsername, password } = credentials;
  const user = {
    login: emailOrUsername,
    password: password
  };

  const response = await axios.post(''+API_URL+'/login', user, {
    withCredentials: true // Ensure cookies are sent with the request
  });

  return response.data;
}

export async function logoutUser() {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
}

export async function verifyUser(token) {
  const response = await axios.post(''+API_URL+'/verify', { token: token, withCredentials: true });
  return response.data;
}