import { useEffect, useState } from "react";
import { createCustomRequest, getMyCustomRequests } from "./api";
import { dateFromToday, formatDate, REQUEST_STATUS } from "./format";

const WEIGHTS = ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg or more"];

const EMPTY_FORM = {
  occasion: "",
  flavour: "",
  weight: "1 kg",
  neededDate: dateFromToday(3),
  description: "",
  budget: "",
};

function CustomCake() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadRequests() {
    try {
      setRequests(await getMyCustomRequests());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await createCustomRequest({ ...form, budget: form.budget ? Number(form.budget) : null });
      setMessage("Request sent! We'll reply here soon 🎉");
      setForm(EMPTY_FORM);
      loadRequests();
    } catch (err) {
      setError(Object.values(err.errors)[0] || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="menu">
      <h2 className="section-title">Design your own cake ✨</h2>
      <p className="section-subtitle">Tell us your idea. We'll reply with a price within a day.</p>

      <div className="checkout-grid">
        <form className="auth-card" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <label htmlFor="occasion">Occasion</label>
          <input id="occasion" name="occasion" maxLength={100} value={form.occasion}
                 onChange={handleChange} placeholder="Birthday, anniversary..." required />

          <label htmlFor="flavour">Flavour</label>
          <input id="flavour" name="flavour" maxLength={100} value={form.flavour}
                 onChange={handleChange} placeholder="Chocolate, butterscotch..." required />

          <label htmlFor="weight">Size</label>
          <select id="weight" name="weight" className="form-select"
                  value={form.weight} onChange={handleChange}>
            {WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>

          <label htmlFor="neededDate">Date needed</label>
          <input id="neededDate" name="neededDate" type="date" min={dateFromToday(2)}
                 value={form.neededDate} onChange={handleChange} required />

          <label htmlFor="description">Your design idea</label>
          <textarea id="description" name="description" rows={4} maxLength={1000}
                    value={form.description} onChange={handleChange}
                    placeholder="Colours, theme, text on the cake, decorations..." required />

          <label htmlFor="budget">Budget in ₹ (optional)</label>
          <input id="budget" name="budget" type="number" min="1" value={form.budget} onChange={handleChange} />

          <p className="field-hint">Have a reference photo? Send it to us on WhatsApp after submitting.</p>

          <button type="submit" className="auth-button" disabled={saving}>
            {saving ? "Sending..." : "Send request"}
          </button>
        </form>

        <div className="order-list custom-list">
          <h3 className="custom-list-title">My requests</h3>
          {requests.length === 0 && <p className="field-hint">No requests yet.</p>}
          {requests.map((r) => (
            <article className="order-card" key={r.id}>
              <div className="order-header">
                <div>
                  <h3>{r.occasion} · {r.weight}</h3>
                  <p>{r.flavour} · needed on {formatDate(r.neededDate)}</p>
                </div>
                <span className={`status-badge ${REQUEST_STATUS[r.status][1]}`}>
                  {REQUEST_STATUS[r.status][0]}
                </span>
              </div>
              <p className="order-note">{r.description}</p>
              {r.quotedPrice && <p className="order-note"><strong>Our price: ₹{r.quotedPrice}</strong></p>}
              {r.adminReply && <p className="order-note">💬 {r.adminReply}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomCake;
