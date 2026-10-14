import { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminCakes from "./AdminCakes";
import AdminCustomers from "./AdminCustomers";
import AdminHolidays from "./AdminHolidays";
import AdminRequests from "./AdminRequests";

const TABS = [
  { key: "orders", label: "📋 Orders" },
  { key: "cakes", label: "🎂 Cakes" },
  { key: "customers", label: "👥 Customers" },
  { key: "holidays", label: "📅 Holidays" },
  { key: "requests", label: "✨ Custom requests" },
];

function Admin() {
  const [tab, setTab] = useState("orders");   // which tab is open

  return (
    <section className="menu">
      <h2 className="section-title">Admin dashboard 👩‍🍳</h2>

      <div className="filters admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={t.key === tab ? "filter active" : "filter"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && <AdminOrders />}
      {tab === "cakes" && <AdminCakes />}
      {tab === "customers" && <AdminCustomers />}
      {tab === "holidays" && <AdminHolidays />}
      {tab === "requests" && <AdminRequests />}
    </section>
  );
}

export default Admin;
