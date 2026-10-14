import { useState } from "react";
import { addReview } from "./api";

function RateCake({ cakeId, onDone }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await addReview({ cakeId, rating, comment });
      onDone();   // tell MyOrders: this cake is reviewed now
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  // Closed: just a small button
  if (!open) {
    return <button className="rate-button" onClick={() => setOpen(true)}>⭐ Rate this cake</button>;
  }

  // Open: stars + comment
  return (
    <form className="rate-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={star <= rating ? "star on" : "star"}
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea rows={2} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="How was the cake? (optional)" aria-label="Your review" />

      <button type="submit" className="filter active" disabled={saving}>
        {saving ? "Sending..." : "Submit review"}
      </button>
    </form>
  );
}

export default RateCake;
