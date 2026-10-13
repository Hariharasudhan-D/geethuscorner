import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";   // 🆕 Navigate
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ChangePassword from "./ChangePassword";                           // 🆕
import "./App.css";

function getSavedUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

function App() {
  const [user, setUser] = useState(getSavedUser);

  function handleLogin(data) {
    const userInfo = { name: data.name, email: data.email, role: data.role };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  // 🆕 Give the wristband back
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />      {/* 🆕 */}

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          {/* 🆕 Logged in → show the page, else send to Login */}
          <Route
            path="/change-password"
            element={user ? <ChangePassword /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<p className="status-message">Page not found 🍰</p>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;