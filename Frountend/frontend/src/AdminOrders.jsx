import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "./api";
import { dateFromToday, formatDate, formatStatus, TIME_SLOTS } from "./format";

const STATUSES = ["PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED", "CANCELLED"];

// The filter buttons at the top
const FILTERS = [
  { label: "Active", value: "ACTIVE" },        // still to do
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "All", value: "ALL" },
];

// Finished orders can't change any more
function isFinished(status) {
  return status === "DELIVERED" || status === "CANCELLED";
}

// Does this order belong under the chosen filter?
function matchesFilter(order, filter) {
  if (filter === "ALL") return true;
  if (filter === "ACTIVE") return !isFinished(order.status);
  return order.status === filter;
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ACTIVE");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      setOrders(await getAllOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // Move the sticker 🏷️
  async function handleStatusChange(order, newStatus) {
    if (newStatus === "CANCELLED" && !window.confirm(`Cancel order #${order.id}?`)) {
      return;   // she pressed "Cancel" on the question, so do nothing
    }
    setError("");
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));   // replace only that order
    } catch (err) {
      setError(err.message);
    }
  }

  const shownOrders = orders.filter((order) => matchesFilter(order, filter));

  // Summary numbers 📊
  const today = dateFromToday(0);                 // e.g. "2026-10-14"
  const thisMonth = today.slice(0, 7);            // e.g. "2026-10"

  const todaysDeliveries = orders.filter(
    (o) => o.deliveryDate === today && o.status !== "CANCELLED"
  ).length;

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  const monthSales = orders
    .filter((o) => o.status === "DELIVERED" && o.deliveryDate.startsWith(thisMonth))
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="admin-header">
        <h2 className="section-title">Orders 📋</h2>
        <button className="filter" onClick={loadOrders}>↻ Refresh</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Today's deliveries</span>
          <strong>{todaysDeliveries}</strong>
        </div>
        <div className="stat-card">
          <span>Waiting to confirm</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="stat-card">
          <span>Sales this month</span>
          <strong>₹{monthSales.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={f.value === filter ? "filter active" : "filter"}
            onClick={() => setFilter(f.value)}
          >
            {f.label} ({orders.filter((o) => matchesFilter(o, f.value)).length})
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading orders...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && shownOrders.length === 0 && (
        <p className="status-message">No orders here.</p>
      )}

      <div className="order-list">
        {shownOrders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>Placed on {formatDate(order.createdAt)}</p>
              </div>

              {/* Status dropdown (locked when finished) */}
              <select
                className={`status-select status-${order.status.toLowerCase()}`}
                value={order.status}
                disabled={isFinished(order.status)}
                onChange={(e) => handleStatusChange(order, e.target.value)}
                aria-label={`Status of order ${order.id}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{formatStatus(s)}</option>
                ))}
              </select>
            </div>

            {/* Customer, with call and WhatsApp buttons */}
            <div className="admin-customer">
              <strong>{order.customerName}</strong>
              <a href={`tel:+91${order.phone}`}>📞 {order.phone}</a>
              <a href={`https://wa.me/91${order.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>

            <p className="admin-delivery">
              {order.deliveryType === "DELIVERY" ? "🚚 Delivery" : "🏠 Pickup"} on{" "}
              <strong>{formatDate(order.deliveryDate)}</strong>
              {order.timeSlot && <> · {TIME_SLOTS[order.timeSlot]}</>}
              {order.address && <> · {order.address}</>}
            </p>

            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  <span>{item.cakeName} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="order-footer">
              <span>{order.paymentMethod === "CASH" ? "💵 Cash" : "📱 UPI"} on delivery</span>
              <strong>₹{order.total}</strong>
            </div>

            {order.note && <p className="order-note">📝 {order.note}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
