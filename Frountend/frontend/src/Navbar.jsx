import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">Geethu's Corner 🍰</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#menu">Menu</a>                   {/* go to Home, then jump to the menu */}
          <a href="#contact">Contact</a>              {/* footer is on every page */}
          <Link to="/login" className="nav-button">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;