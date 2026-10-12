// Top bar: shop name on the left, links on the right
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="logo">Geethu's Corner 🍰</a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;