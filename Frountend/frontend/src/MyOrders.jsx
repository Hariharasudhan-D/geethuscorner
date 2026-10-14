import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import RateCake from "./RateCake";
import { cancelOrder, getMyOrders, getMyReviewedCakeIds } from "./api";
import { formatDate, TIME_SLOTS } from "./format";

const STEPS = ["PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED"];

const STEP_LABELS = {
  PENDING: "Placed",
  CONFIRMED: "Confirmed",
  BAKING: "Baking",
  READY: "Ready",
  DELIVERED: "Delivered",
};

// The progress line ✓ ✓ ● ○ ○
function Timeline({ status }) {
  if (status === "CANCELLED") {
    return <p className="timeline-cancelled">❌ This order was cancelled</p>;
  }

  const currentIndex = STEPS.indexOf(status);   // e.g. BAKING → 2

  return (
    <ol className="timeline">
      {STEPS.map((step, index) => (
        <li key={step} className={index <= currentIndex ? "done" : ""}>
          <span className="dot" aria-hidden="true">{index <= currentIndex ? "✓" : ""}</span>
          {STEP_LABELS[step]}
        </li>
      ))}
    </ol>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewedIds, setReviewedIds] = useState([]);   // cakes I already reviewed

  // The order id Checkout sent us (only right after ordering)
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  async function loadOrders() {
    setLoading(true);
    try {
      setOrders(await getMyOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    getMyReviewedCakeIds().then(setReviewedIds).catch(() => {});
  }, []);

  async function handleCancel(order) {
    if (!window.confirm(`Cancel order #${order.id}?`)) return;
    setError("");
    try {
      const updated = await cancelOrder(order.id);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="menu">
      <div className="admin-header">
        <h2 className="section-title">My orders 📦</h2>
        <button className="filter" onClick={loadOrders}>↻ Refresh</button>
      </div>

      {placedOrderId && (
        <p className="form-success order-placed">🎉 Order #{placedOrderId} placed! We'll confirm it soon.</p>
      )}

      {loading && <p className="status-message">Loading your orders...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && orders.length === 0 && (
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
              <strong>₹{order.total}</strong>
            </div>

            <Timeline status={order.status} />

            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  <span>{item.cakeName} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                  {order.status === "DELIVERED" && !reviewedIds.includes(item.cakeId) && (
                    <RateCake
                      cakeId={item.cakeId}
                      onDone={() => setReviewedIds([...reviewedIds, item.cakeId])}
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="order-footer">
              <span>
                {order.deliveryType === "DELIVERY" ? "🚚 Delivery" : "🏠 Pickup"}
                {" on "}
                {formatDate(order.deliveryDate)}
                {order.timeSlot && <> · {TIME_SLOTS[order.timeSlot]}</>}
                {" · "}
                {order.paymentMethod === "CASH" ? "Cash" : "UPI"} on delivery
              </span>
            </div>

            {order.note && <p className="order-note">📝 {order.note}</p>}

            {order.status === "PENDING" && (
              <button className="cancel-button" onClick={() => handleCancel(order)}>Cancel order</button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyOrders;
