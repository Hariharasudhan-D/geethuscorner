import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login, signup } from "./api";

function Signup({ onLogin }) {
  // All 4 boxes in ONE object
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});   // errors under each box
  const [error, setError] = useState("");               // error at the top
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // One function for all boxes: uses the box's "name" to know which field changed
  function handleChange(event) {
    let value = event.target.value;

    if (event.target.name === "phone") {
      value = value.replace(/\D/g, "");   // keep digits only (removes spaces, +, letters)
    }

    setForm({ ...form, [event.target.name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await signup(form);                                 // 1. create the account
      const data = await login(form.email, form.password); // 2. log in automatically 😊
      onLogin(data);
      navigate("/");
    } catch (err) {
      setError(err.message);              // e.g. "This email is already registered"
      setFieldErrors(err.errors || {});   // e.g. { phone: "Enter a valid 10-digit mobile number" } ({} if the server was unreachable)
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-subtitle">Join us to order fresh homemade cakes.</p>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange}
               placeholder="Your name" autoComplete="name" required />
        {fieldErrors.name && <small className="field-error">{fieldErrors.name}</small>}

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
               placeholder="you@example.com" autoComplete="email" required />
        {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}

        <label htmlFor="phone">Mobile number</label>
        <div className="phone-box">
          <span>+91</span>
          <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10}
                 value={form.phone} onChange={handleChange}
                 placeholder="10-digit number" autoComplete="tel-national" required />
        </div>
        {fieldErrors.phone && <small className="field-error">{fieldErrors.phone}</small>}

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
               placeholder="Create a password" autoComplete="new-password" minLength={8} required />
        {fieldErrors.password
          ? <small className="field-error">{fieldErrors.password}</small>
          : <small className="field-hint">At least 8 characters</small>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;