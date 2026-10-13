import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);   // is the dropdown open?
  const navigate = useNavigate();

  function handleLogout() {
    setMenuOpen(false);
    onLogout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">Geethu's Corner 🍰</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#menu">Menu</a>
          <a href="#contact">Contact</a>

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