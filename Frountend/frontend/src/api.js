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
  // 🆕 Wristband rejected (expired or fake) → log out and go to Login.
  // Not for login/signup themselves, where 401 just means "wrong password".
  const isAuthPage = path === "/api/auth/login" || path === "/api/auth/signup";
  if (response.status === 401 && token && !isAuthPage) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

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
// Change my own password (needs the wristband, added automatically)
export function changePassword(oldPassword, newPassword) {
  return request("/api/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}
// 🆕 Who am I? (needs the wristband)
export function getMe() {
  return request("/api/auth/me");
}
// ---------- Orders ----------
export function placeOrder(order) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getMyOrders() {
  return request("/api/orders/my");
}

export function cancelOrder(id) {
  return request(`/api/orders/${id}/cancel`, { method: "PUT" });
}

// ---------- Admin: orders ----------
export function getAllOrders() {
  return request("/api/admin/orders");
}

export function updateOrderStatus(id, status) {
  return request(`/api/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ---------- Admin: cakes ----------
export function getAllCakesAdmin() {
  return request("/api/cakes/all");
}

export function createCake(cake) {
  return request("/api/cakes", { method: "POST", body: JSON.stringify(cake) });
}

export function updateCake(id, cake) {
  return request(`/api/cakes/${id}`, { method: "PUT", body: JSON.stringify(cake) });
}

export function deleteCake(id) {
  return request(`/api/cakes/${id}`, { method: "DELETE" });
}

// Upload a cake photo. Returns the photo's public link.
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/admin/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    // NO Content-Type here: the browser sets it for FormData by itself
    body: formData,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Photo upload failed");
  }
  return data.url;
}

// ---------- Admin: customers ----------
export function getAllUsers() {
  return request("/api/admin/users");
}

// ---------- Booking ----------
export function getBookingInfo() {
  return request("/api/booking-info");
}

export function getClosedDates() {
  return request("/api/admin/closed-dates");
}

export function addClosedDate(data) {
  return request("/api/admin/closed-dates", { method: "POST", body: JSON.stringify(data) });
}

export function deleteClosedDate(id) {
  return request(`/api/admin/closed-dates/${id}`, { method: "DELETE" });
}

// ---------- Custom cakes ----------
export function createCustomRequest(data) {
  return request("/api/custom-requests", { method: "POST", body: JSON.stringify(data) });
}

export function getMyCustomRequests() {
  return request("/api/custom-requests/my");
}

export function getAllCustomRequests() {
  return request("/api/admin/custom-requests");
}

export function updateCustomRequest(id, data) {
  return request(`/api/admin/custom-requests/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

// ---------- Reviews ----------
export function addReview(data) {
  return request("/api/reviews", { method: "POST", body: JSON.stringify(data) });
}

export function getMyReviewedCakeIds() {
  return request("/api/reviews/mine");
}

export function getLatestReviews() {
  return request("/api/reviews/latest");
}

export function getRatingSummaries() {
  return request("/api/reviews/summary");
}

export function deleteReview(id) {
  return request(`/api/admin/reviews/${id}`, { method: "DELETE" });
}

// ---------- Cake assistant ----------
export function sendChatMessage(message) {
  return request("/api/chat", { method: "POST", body: JSON.stringify({ message }) });
}
