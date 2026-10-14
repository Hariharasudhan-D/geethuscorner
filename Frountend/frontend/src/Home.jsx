import { useEffect, useState } from "react";
import { getCakes, getRatingSummaries } from "./api";
import Hero from "./Hero";
import CakeCard from "./CakeCard";
import Reviews from "./Reviews";

// Home page: welcome banner + cake menu
function Home({ onAddToCart, user }) {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [ratings, setRatings] = useState({});   // { 3: { cakeId: 3, average: 4.5, count: 2 } }

  useEffect(() => {
    getRatingSummaries()
      .then((list) => {
        const map = {};
        for (const r of list) {
          map[r.cakeId] = r;   // look-up by cake id
        }
        setRatings(map);
      })
      .catch(() => {});
  }, []);

  // Load cakes once when the page opens
  useEffect(() => {
    async function loadCakes() {
      try {
        const data = await getCakes();
        setCakes(data);
      } catch {
        setError("Sorry, we couldn't load the cakes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadCakes();
  }, []);

  const categories = ["All", ...new Set(cakes.map((cake) => cake.category))];

  const shownCakes =
    category === "All"
      ? cakes
      : cakes.filter((cake) => cake.category === category);

  return (
    <>
      <Hero />

      <section className="menu" id="menu">
        <h2 className="section-title">Our Cakes</h2>
        <p className="section-subtitle">Freshly baked at home, every single day.</p>

        <div className="filters">
          {categories.map((c) => (
            <button
              key={c}
              className={c === category ? "filter active" : "filter"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="status-message">Loading cakes... 🎂</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && shownCakes.length === 0 && (
          <p className="status-message">No cakes here yet.</p>
        )}

        <div className="cake-grid">
          {shownCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} onAddToCart={onAddToCart} rating={ratings[cake.id]} />
          ))}
        </div>
      </section>

      <Reviews user={user} />
    </>
  );
}

export default Home;