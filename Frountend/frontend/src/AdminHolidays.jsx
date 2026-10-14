import { useEffect, useState } from "react";
import { addClosedDate, deleteClosedDate, getClosedDates } from "./api";
import { dateFromToday, formatDate } from "./format";

function AdminHolidays() {
  const [dates, setDates] = useState([]);
  const [closedOn, setClosedOn] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function loadDates() {
    try {
      setDates(await getClosedDates());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadDates();
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    try {
      await addClosedDate({ closedOn, reason });
      setClosedOn("");
      setReason("");
      loadDates();
    } catch (err) {
      setError(Object.values(err.errors)[0] || err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteClosedDate(id);
      loadDates();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-section">
      <form className="auth-card admin-form" onSubmit={handleAdd}>
        <h3>Close the shop on a date</h3>
        <p className="field-hint">Customers can't order for these dates.</p>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="closed-on">Date</label>
        <input id="closed-on" type="date" min={dateFromToday(0)} value={closedOn}
               onChange={(e) => setClosedOn(e.target.value)} required />

        <label htmlFor="closed-reason">Reason (optional)</label>
        <input id="closed-reason" maxLength={100} value={reason}
               onChange={(e) => setReason(e.target.value)} placeholder="e.g. Family function" />

        <button type="submit" className="auth-button">Add holiday</button>
      </form>

      <div className="order-list">
        {dates.length === 0 && <p className="status-message">No holidays added.</p>}
        {dates.map((d) => (
          <div className="admin-cake" key={d.id}>
            <div className="admin-cake-info">
              <strong>📅 {formatDate(d.closedOn)}</strong>
              <span>{d.reason || "Closed"}</span>
            </div>
            <button className="filter danger" onClick={() => handleDelete(d.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHolidays;
