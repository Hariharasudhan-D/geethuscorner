import { useEffect, useState } from "react";
import { getAllUsers } from "./api";
import { formatDate } from "./format";

function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers().then(setUsers).catch((err) => setError(err.message));
  }, []);

  // Search by name, email or phone
  const text = search.toLowerCase();
  const shownUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(text) ||
      u.email.includes(text) ||
      (u.phone || "").includes(text)
  );

  return (
    <div>
      <p className="section-subtitle">{users.length} registered users</p>

      <input className="search-box" type="search" value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search name, email or phone" aria-label="Search customers" />

      {error && <p className="status-message error">{error}</p>}

      <div className="table-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Orders</th><th>Role</th>
            </tr>
          </thead>
          <tbody>
            {shownUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><a href={`tel:+91${u.phone}`}>{u.phone}</a></td>
                <td>{formatDate(u.createdAt)}</td>
                <td>{u.orderCount}</td>
                <td>{u.role === "ADMIN" ? "👩‍🍳 Admin" : "Customer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomers;
