import { useState } from "react";
import { changePassword } from "./api";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Quick check in the browser (the backend checks again)
    if (newPassword !== confirm) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await changePassword(oldPassword, newPassword);
      setSuccess(data.message);          // "Password changed successfully"
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      // Backend message, or the field error (e.g. "must be 8 to 72 characters")
      setError(err.errors?.newPassword || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Change password</h1>
        <p className="auth-subtitle">Enter your old password, then choose a new one.</p>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <label htmlFor="old">Old password</label>
        <input id="old" type="password" value={oldPassword}
               onChange={(e) => setOldPassword(e.target.value)}
               autoComplete="current-password" required />

        <label htmlFor="new">New password</label>
        <input id="new" type="password" value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               autoComplete="new-password" minLength={8} required />
        <small className="field-hint">At least 8 characters</small>

        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" value={confirm}
               onChange={(e) => setConfirm(e.target.value)}
               autoComplete="new-password" required />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Saving..." : "Change password"}
        </button>
      </form>
    </section>
  );
}

export default ChangePassword;