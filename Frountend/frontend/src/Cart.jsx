import { Link } from "react-router";

function Cart({ cart, onChangeQuantity, onRemove }) {
  // Total = price × quantity for each cake, added together
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Empty basket
  if (cart.length === 0) {
    return (
      <section className="menu">
        <h2 className="section-title">Your cart 🛒</h2>
        <p className="status-message">Your cart is empty.</p>
        <p className="status-message">
          <Link to="/" className="cart-link">Browse our cakes</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="menu">
      <h2 className="section-title">Your cart 🛒</h2>

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>₹{item.price} each</p>
            </div>

            <div className="cart-quantity">
              <button onClick={() => onChangeQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
              <span>{item.quantity}</span>
              <button onClick={() => onChangeQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
            </div>

            <div className="cart-price">₹{item.price * item.quantity}</div>

            <button className="cart-remove" onClick={() => onRemove(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total</span>
        <strong>₹{total}</strong>
      </div>

      <div className="cart-actions">
        <Link to="/" className="cart-link">← Continue shopping</Link>
        <Link to="/checkout" className="auth-button cart-checkout">Proceed to checkout</Link>
      </div>
    </section>
  );
}

export default Cart;
