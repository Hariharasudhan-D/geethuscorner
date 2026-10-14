import { useEffect, useState } from "react";                              // 🆕 useEffect
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ChangePassword from "./ChangePassword";
import Admin from "./Admin";                                              // 🆕
import { getMe } from "./api";                                            // 🆕
import "./App.css";

function getSavedUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

function App() {
  const [user, setUser] = useState(getSavedUser);

  // 🆕 When the website opens, ask the backend "who am I?" once.
  // Dead wristband → api.js logs us out. Alive → we refresh name and role from the backend.
  useEffect(() => {
    if (!user) return;
    getMe()
      .then((data) => {
        const info = { name: data.name, email: data.email, role: data.role };
        localStorage.setItem("user", JSON.stringify(info));
        setUser(info);
      })
      .catch(() => {});   // other errors (like the server sleeping): keep the saved user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogin(data) {
    const userInfo = { name: data.name, email: data.email, role: data.role };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route
            path="/change-password"
            element={user ? <ChangePassword /> : <Navigate to="/login" />}
          />
          {/* 🆕 Admin only: not logged in → Login, logged in but not admin → Home */}
          <Route
            path="/admin"
            element={
              !user ? <Navigate to="/login" />
              : user.role === "ADMIN" ? <Admin />
              : <Navigate to="/" />
            }
          />
          <Route path="*" element={<p className="status-message">Page not found 🍰</p>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;