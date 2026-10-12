// Bottom of the page: contact details
function Footer() {
  const year = new Date().getFullYear();   // current year, e.g. 2026

  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">

        <div>
          <h3>Geethu's Corner 🍰</h3>
          <p>Homemade cakes, baked fresh to order.</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>📞 +91 00000 00000</p>
          <p>📍 Your shop address here</p>
        </div>

        <div>
          <h4>Order timings</h4>
          <p>Mon – Sun: 9 AM – 8 PM</p>
        </div>

      </div>

      <p className="footer-bottom">© {year} Geethu's Corner. All rights reserved.</p>
    </footer>
  );
}

export default Footer;