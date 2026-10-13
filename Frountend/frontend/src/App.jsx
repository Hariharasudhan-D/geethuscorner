import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

// Read the saved user from the browser's pocket (or null if nobody is logged in)
function getSavedUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

function App() {
  // Who is logged in? Starts with the saved user, so a page refresh keeps you logged in
  const [user, setUser] = useState(getSavedUser);

  // Called after a successful login: save the wristband + user info
  function handleLogin(data) {
    const userInfo = { name: data.name, email: data.email, role: data.role };

    localStorage.setItem("token", data.token);                 // the wristband 🎟️
    localStorage.setItem("user", JSON.stringify(userInfo));    // name, email, role
    setUser(userInfo);                                         // tell React
  }

  return (
    <BrowserRouter>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="*" element={<p className="status-message">Page not found 🍰</p>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;