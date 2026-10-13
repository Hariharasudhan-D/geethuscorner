import { Link, useNavigate } from "react-router";

// "user" is null when nobody is logged in
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();      // clear the wristband (App.jsx)
    navigate("/");   // go to Home
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
            <>
              {/* Only the admin sees this link */}
              {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
              <Link to="/change-password">Change password</Link>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;