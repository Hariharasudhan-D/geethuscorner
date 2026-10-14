import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ChangePassword from "./ChangePassword";
import Admin from "./Admin";
import Cart from "./Cart";                       // 🆕
import Checkout from "./Checkout";
import MyOrders from "./MyOrders";
import CustomCake from "./CustomCake";
import ChatBubble from "./ChatBubble";
import { getMe } from "./api";
import "./App.css";

function getSavedUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

// 🆕 Read the saved basket (or an empty one)
function getSavedCart() {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
}

// 🆕 When the page (route) changes, start at the top
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const [user, setUser] = useState(getSavedUser);
  const [cart, setCart] = useState(getSavedCart);   // 🆕

  // Ask the backend "who am I?" once when the website opens
  useEffect(() => {
    if (!user) return;
    getMe()
      .then((data) => {
        const info = { name: data.name, email: data.email, role: data.role };
        localStorage.setItem("user", JSON.stringify(info));
        setUser(info);
      })
      .catch(() => {});
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

  // ---------- 🆕 Basket functions ----------

  // Update the basket on screen AND in the browser's pocket
  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  // Add one cake (if it is already in the basket, quantity + 1)
  function addToCart(cake) {
    const existing = cart.find((item) => item.id === cake.id);

    if (existing) {
      changeQuantity(cake.id, 1);
    } else {
      saveCart([...cart, { id: cake.id, name: cake.name, price: cake.price, quantity: 1 }]);
    }
  }

  // change = +1 or -1. Quantity stays between 1 and 10.
  function changeQuantity(id, change) {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(Math.max(item.quantity + change, 1), 10) }
        : item
    );
    saveCart(newCart);
  }

  function removeFromCart(id) {
    saveCart(cart.filter((item) => item.id !== id));
  }

  // Empty the basket after a successful order
  function clearCart() {
    saveCart([]);
  }

  // Total number of cakes (for the navbar)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />                                            {/* 🆕 */}
      <Navbar user={user} onLogout={handleLogout} cartCount={cartCount} />   {/* 🆕 */}

      <main className="container">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} user={user} />} />      {/* 🆕 */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onChangeQuantity={changeQuantity}
                onRemove={removeFromCart}
              />
            }
          />                                                                  {/* 🆕 */}
          <Route
            path="/change-password"
            element={user ? <ChangePassword /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              !user ? <Navigate to="/login" />
              : user.role === "ADMIN" ? <Admin />
              : <Navigate to="/" />
            }
          />
          <Route
            path="/checkout"
            element={
              user ? <Checkout cart={cart} onOrderPlaced={clearCart} />
                   : <Navigate to="/login" state={{ from: "/checkout" }} />
            }
          />
          <Route
            path="/my-orders"
            element={
              user ? <MyOrders />
                   : <Navigate to="/login" state={{ from: "/my-orders" }} />
            }
          />
          <Route
            path="/custom-cake"
            element={user ? <CustomCake /> : <Navigate to="/login" state={{ from: "/custom-cake" }} />}
          />
          <Route path="*" element={<p className="status-message">Page not found 🍰</p>} />
        </Routes>
      </main>

      <Footer />
      <ChatBubble user={user} />
    </BrowserRouter>
  );
}

export default App;