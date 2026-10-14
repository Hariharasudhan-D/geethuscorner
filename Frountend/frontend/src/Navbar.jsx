import { useState } from "react";
import { Link, useNavigate } from "react-router";

// Smoothly scroll to the top of the page
function goTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Navbar({ user, onLogout, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    setMenuOpen(false);
    onLogout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" onClick={goTop}>Geethu's Corner 🍰</Link>

        <div className="nav-links">
          <Link to="/" onClick={goTop}>Home</Link>
          <a href="/#menu">Menu</a>
          <a href="#contact">Contact</a>
          <Link to="/cart">🛒 Cart ({cartCount})</Link>

          {user ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setMenuOpen(!menuOpen)}>
                Hi, {user.name.split(" ")[0]} ▾
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  {user.role === "ADMIN" && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin dashboard</Link>
                  )}
                  <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My orders</Link>
                  <Link to="/change-password" onClick={() => setMenuOpen(false)}>Change password</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;