import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />                          {/* on every page */}

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<p className="status-message">Page not found 🍰</p>} />
        </Routes>
      </main>

      <Footer />                          {/* on every page */}
    </BrowserRouter>
  );
}

export default App;