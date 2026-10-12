// Big welcome banner at the top of the page
function Hero() {
  return (
    <section className="hero" id="home">

      {/* Left side: text */}
      <div className="hero-text">
        <span className="hero-tag">Homemade with love ❤️</span>
        <h1>
          Fresh cakes for every <span>sweet moment</span>
        </h1>
        <p>
          Birthdays, anniversaries or just a happy Sunday.
          Order a freshly baked cake from our home kitchen.
        </p>
        <a href="#menu" className="hero-button">See our cakes</a>
      </div>

      {/* Right side: big floating cake */}
      <div className="hero-image">
        <span>🎂</span>
      </div>

    </section>
  );
}

export default Hero;