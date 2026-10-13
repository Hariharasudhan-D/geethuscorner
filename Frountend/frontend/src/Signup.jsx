import { Link } from "react-router";

// Signup page (the real form comes in Step 2)
function Signup() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p>The signup form is coming in the next step 🙂</p>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;