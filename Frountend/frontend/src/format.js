// "2026-10-20" or "2026-10-14T08:35:12" → "20 Oct 2026"
export function formatDate(value) {
  const day = new Date(value.slice(0, 10) + "T00:00:00");
  return day.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// "PENDING" → "Pending"
export function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

// Today + some days, as "YYYY-MM-DD" in local time ("en-CA" writes dates that way)
export function dateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-CA");
}

export const TIME_SLOTS = {
  MORNING: "Morning (10 AM – 1 PM)",
  AFTERNOON: "Afternoon (1 PM – 4 PM)",
  EVENING: "Evening (4 PM – 8 PM)",
};

// Request status → [text to show, colour class]
export const REQUEST_STATUS = {
  PENDING: ["Waiting for reply", "status-pending"],
  ACCEPTED: ["Accepted", "status-delivered"],
  REJECTED: ["Not possible", "status-cancelled"],
};
