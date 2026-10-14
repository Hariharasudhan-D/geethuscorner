import { useEffect, useState } from "react";
import { deleteReview, getLatestReviews } from "./api";

function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getLatestReviews().then(setReviews).catch(() => {});
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (reviews.length === 0) return null;   // hide the section until there are reviews

  return (
    <section className="menu">
      <h2 className="section-title">What our customers say 💬</h2>
      <div className="review-grid">
        {reviews.map((r) => (
          <article className="review-card" key={r.id}>
            <p className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </p>
            {r.comment && <p className="review-comment">"{r.comment}"</p>}
            <p className="review-author">— {r.customerName}, on {r.cakeName}</p>
            {user?.role === "ADMIN" && (
              <button className="cart-remove" onClick={() => handleDelete(r.id)}>Delete review</button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
