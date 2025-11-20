/**
 * Récupère les rôles depuis le cookie `user`.
 * @returns {string[]} Liste des rôles ou ["guest"] si absent.
 */
export default function getUserRole() {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (!cookie) return ["guest"];
    const value = cookie.split("=")[1];
    const decoded = JSON.parse(decodeURIComponent(value));
    return Array.isArray(decoded.role) ? decoded.role : ["guest"];
  } catch (err) {
    console.error("Erreur parsing cookie 'user':", err);
    return ["guest"];
  }
}
