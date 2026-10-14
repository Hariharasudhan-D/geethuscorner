import { useEffect, useState } from "react";
import { getAllCustomRequests, updateCustomRequest } from "./api";
import { formatDate, REQUEST_STATUS } from "./format";

// One request, with its OWN small reply form
function RequestCard({ request, onSaved }) {
  const [status, setStatus] = useState(request.status);
  const [quotedPrice, setQuotedPrice] = useState(request.quotedPrice ?? "");
  const [adminReply, setAdminReply] = useState(request.adminReply ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const updated = await updateCustomRequest(request.id, {
        status,
        quotedPrice: quotedPrice === "" ? null : Number(quotedPrice),
        adminReply,
      });
      onSaved(updated);
    } catch (err) {
      setError(Object.values(err.errors)[0] || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="order-card">
      <div className="order-header">
        <div>
          <h3>#{request.id} · {request.occasion} · {request.weight}</h3>
          <p>{request.flavour} · needed on <strong>{formatDate(request.neededDate)}</strong></p>
        </div>
        <span className={`status-badge ${REQUEST_STATUS[request.status][1]}`}>
          {REQUEST_STATUS[request.status][0]}
        </span>
      </div>

      <div className="admin-customer">
        <strong>{request.customerName}</strong>
        <a href={`tel:+91${request.phone}`}>📞 {request.phone}</a>
        <a href={`https://wa.me/91${request.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>

      <p className="order-note">{request.description}</p>
      {request.budget && <p className="order-note">Budget: ₹{request.budget}</p>}

      <div className="reply-box">
        {error && <p className="form-error">{error}</p>}
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}
                aria-label="Request status">
          <option value="PENDING">Waiting for reply</option>
          <option value="ACCEPTED">Accept</option>
          <option value="REJECTED">Not possible</option>
        </select>
        <input type="number" min="1" placeholder="Price ₹" value={quotedPrice}
               onChange={(e) => setQuotedPrice(e.target.value)} aria-label="Quoted price" />
        <textarea rows={2} maxLength={500} placeholder="Message to the customer" value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)} aria-label="Reply" />
        <button className="filter active" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save reply"}
        </button>
      </div>
    </article>
  );
}

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCustomRequests().then(setRequests).catch((err) => setError(err.message));
  }, []);

  // Put the saved request back into the list
  function handleSaved(updated) {
    setRequests(requests.map((r) => (r.id === updated.id ? updated : r)));
  }

  return (
    <div className="order-list">
      {error && <p className="status-message error">{error}</p>}
      {requests.length === 0 && <p className="status-message">No custom requests yet.</p>}
      {requests.map((r) => (
        <RequestCard key={r.id} request={r} onSaved={handleSaved} />
      ))}
    </div>
  );
}

export default AdminRequests;
