// Backend address. Locally port 8080. On the live site we set VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ONE helper for ALL backend calls.
// It adds the wristband (if we have one) and turns backend errors into JS errors.
async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;   // show the wristband 🎟️
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Read the JSON answer (some answers have no body, so we allow "null")
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Use the backend's own message, e.g. "Wrong email or password"
    const error = new Error(data?.message || "Something went wrong. Please try again.");
    error.errors = data?.errors || {};   // field errors, e.g. { phone: "Enter a valid..." }
    throw error;
  }

  return data;
}

// ---------- Cakes ----------
export function getCakes() {
  return request("/api/cakes");
}

// ---------- Login / Signup ----------
export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(form) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(form),
  });
}