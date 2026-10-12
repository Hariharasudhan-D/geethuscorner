// Backend address. Locally it's port 8080. On the live site we set VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Ask the backend for all in-stock cakes
export async function getCakes() {
  const response = await fetch(`${API_URL}/api/cakes`);

  if (!response.ok) {
    throw new Error("Could not load cakes");
  }

  return response.json();   // turn the JSON text into a JavaScript list
}