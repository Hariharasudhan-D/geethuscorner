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
          <p>📞 <a href="tel:+916369512910">+91 63695 12910</a></p>
          <p>💬 <a href="https://wa.me/916369512910" target="_blank" rel="noreferrer">WhatsApp us</a></p>
          <p>📍 Chennimalai, Erode</p>
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