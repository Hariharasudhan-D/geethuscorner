import { Link } from "react-router";

// Login page (the real form comes in Step 2)
function Login() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>The login form is coming in the next step 🙂</p>
        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;