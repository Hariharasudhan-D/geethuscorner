import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { login } from "./api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();   // lets us move to another page in code
  const location = useLocation();   // where did the customer come from?

  async function handleSubmit(event) {
    event.preventDefault();   // stop the browser from reloading the page
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);   // ask the backend
      onLogin(data);                                // save wristband + user (App.jsx)
      navigate(location.state?.from || "/");   // back to checkout, or Home
    } catch (err) {
      setError(err.message);                        // e.g. "Wrong email or password"
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="auth-subtitle">Welcome back! Enter your details to continue.</p>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-box">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
          <button type="button" className="show-button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;