const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000/ai' // Production API address
  : 'http://localhost:3010/api/ai'; // Local API address for testing

export async function askIA(message, token) {
  const response = await fetch(API_URL+"/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the Bearer token
    },
    body: JSON.stringify({ message }),
    credentials: "include", // Ensure cookies are sent with the request
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}

export async function generateImage(message, token) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt: message }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data.imageUrl;
}

