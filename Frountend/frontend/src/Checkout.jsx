import { useState } from "react";
import { useNavigate } from "react-router";
import { placeOrder } from "./api";

// Tomorrow's date as "YYYY-MM-DD", in the customer's own time
function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");   // 3 → "03"
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Checkout({ cart, onOrderPlaced }) {
  const [deliveryType, setDeliveryType] = useState("DELIVERY");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(getTomorrow());
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Shown only for display. The backend calculates the real total.
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const order = await placeOrder({
        items: cart.map((item) => ({ cakeId: item.id, quantity: item.quantity })),   // NO price sent
        deliveryType,
        address: deliveryType === "DELIVERY" ? address : "",
        deliveryDate,
        paymentMethod,
        note,
      });

      onOrderPlaced();   // empty the cart (App.jsx)
      navigate("/my-orders", { state: { placedOrderId: order.id } });
    } catch (err) {
      // First field error (e.g. the date), or the general message (e.g. "sold out")
      setError(Object.values(err.errors)[0] || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return <p className="status-message">Your cart is empty.</p>;
  }

  return (
    <section className="menu">
      <h2 className="section-title">Checkout</h2>

      <div className="checkout-grid">
        <form className="auth-card" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          {/* Delivery or pickup */}
          <fieldset className="choice-group">
            <legend>How do you want your cake?</legend>
            <label className={deliveryType === "DELIVERY" ? "choice active" : "choice"}>
              <input type="radio" name="deliveryType" value="DELIVERY"
                     checked={deliveryType === "DELIVERY"}
                     onChange={(e) => setDeliveryType(e.target.value)} />
              🚚 Home delivery
            </label>
            <label className={deliveryType === "PICKUP" ? "choice active" : "choice"}>
              <input type="radio" name="deliveryType" value="PICKUP"
                     checked={deliveryType === "PICKUP"}
                     onChange={(e) => setDeliveryType(e.target.value)} />
              🏠 Pickup from our kitchen
            </label>
          </fieldset>

          {/* Address only for delivery */}
          {deliveryType === "DELIVERY" && (
            <>
              <label htmlFor="address">Delivery address</label>
              <textarea id="address" rows={3} value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no, street, area, city, pincode" required />
            </>
          )}

          <label htmlFor="date">
            {deliveryType === "DELIVERY" ? "Delivery date" : "Pickup date"}
          </label>
          <input id="date" type="date" min={getTomorrow()} value={deliveryDate}
                 onChange={(e) => setDeliveryDate(e.target.value)} required />

          {/* Payment */}
          <fieldset className="choice-group">
            <legend>Payment (pay when you receive the cake)</legend>
            <label className={paymentMethod === "CASH" ? "choice active" : "choice"}>
              <input type="radio" name="paymentMethod" value="CASH"
                     checked={paymentMethod === "CASH"}
                     onChange={(e) => setPaymentMethod(e.target.value)} />
              💵 Cash
            </label>
            <label className={paymentMethod === "UPI" ? "choice active" : "choice"}>
              <input type="radio" name="paymentMethod" value="UPI"
                     checked={paymentMethod === "UPI"}
                     onChange={(e) => setPaymentMethod(e.target.value)} />
              📱 UPI
            </label>
          </fieldset>

          <label htmlFor="note">Note for the baker (optional)</label>
          <textarea id="note" rows={2} maxLength={500} value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='e.g. Write "Happy Birthday Amma"' />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Placing order..." : `Place order · ₹${total}`}
          </button>
        </form>

        {/* Summary on the side */}
        <aside className="order-summary">
          <h3>Order summary</h3>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <p className="field-hint">Prices are confirmed by our kitchen when you place the order.</p>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
