import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getMyOrders } from "./api";

// "2026-10-20" or "2026-10-14T08:35:12" → "20 Oct 2026"
function formatDate(value) {
  const day = new Date(value.slice(0, 10) + "T00:00:00");
  return day.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// "PENDING" → "Pending"
function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The order id Checkout sent us (only right after ordering)
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <section className="menu">
      <h2 className="section-title">My orders 📦</h2>

      {placedOrderId && (
        <p className="form-success order-placed">
          🎉 Order #{placedOrderId} placed! We'll confirm it soon.
        </p>
      )}

      {loading && <p className="status-message">Loading your orders...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="status-message">
          No orders yet. <Link to="/" className="cart-link">Order your first cake 🎂</Link>
        </p>
      )}

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                {formatStatus(order.status)}
              </span>
            </div>

            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  <span>{item.cakeName} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="order-footer">
              <span>
                {order.deliveryType === "DELIVERY" ? "🚚 Delivery" : "🏠 Pickup"} on {formatDate(order.deliveryDate)}
                {" · "}
                {order.paymentMethod === "CASH" ? "Cash" : "UPI"} on delivery
              </span>
              <strong>₹{order.total}</strong>
            </div>

            {order.note && <p className="order-note">📝 {order.note}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyOrders;
