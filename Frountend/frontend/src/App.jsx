import { useEffect, useState } from "react";   // 🆕 useEffect
import { getCakes } from "./api";              // 🆕 instead of products.js
import CakeCard from "./CakeCard";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";
import "./App.css";

function App() {
  const [cakes, setCakes] = useState([]);        // 🆕 cakes from the backend
  const [loading, setLoading] = useState(true);  // 🆕 still waiting?
  const [error, setError] = useState("");        // 🆕 error message
  const [category, setCategory] = useState("All");

  // 🆕 Runs ONCE when the page opens: load cakes from the backend
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

  // 🆕 Categories come from the real cakes ("All" + each category once)
  const categories = ["All", ...new Set(cakes.map((cake) => cake.category))];

  const shownCakes =
    category === "All"
      ? cakes
      : cakes.filter((cake) => cake.category === category);

  return (
    <>
      <Navbar />

      <main className="container">
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

          {/* 🆕 Show a message while loading, on error, or when empty */}
          {loading && <p className="status-message">Loading cakes... 🎂</p>}
          {error && <p className="status-message error">{error}</p>}
          {!loading && !error && shownCakes.length === 0 && (
            <p className="status-message">No cakes here yet.</p>
          )}

          <div className="cake-grid">
            {shownCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;