import { useEffect, useState } from "react";
import { createCake, deleteCake, getAllCakesAdmin, updateCake, uploadImage } from "./api";

const EMPTY_FORM = { name: "", description: "", category: "", price: "", imageUrl: "", available: true };

function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);   // null = adding a NEW cake
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadCakes() {
    try {
      setCakes(await getAllCakesAdmin());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCakes();
  }, []);

  // One function for all boxes. Checkboxes use "checked", the others use "value".
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  // When a photo is chosen: upload it, then put its link in the form
  async function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, imageUrl: url }));   // use the LATEST form
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";   // allow choosing the same file again
    }
  }

  // Fill the form with a cake, to edit it
  function startEdit(cake) {
    setEditingId(cake.id);
    setForm({
      name: cake.name,
      description: cake.description || "",
      category: cake.category,
      price: cake.price,
      imageUrl: cake.imageUrl || "",
      available: cake.available,
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const cakeData = { ...form, price: Number(form.price) };   // "650" → 650

    try {
      if (editingId) {
        await updateCake(editingId, cakeData);
        setMessage("Cake updated ✅");
      } else {
        await createCake(cakeData);
        setMessage("Cake added ✅");
      }
      resetForm();
      loadCakes();
    } catch (err) {
      setError(Object.values(err.errors)[0] || err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cake) {
    if (!window.confirm(`Delete "${cake.name}"? This cannot be undone.`)) return;
    try {
      await deleteCake(cake.id);
      loadCakes();
    } catch (err) {
      setError(err.message);
    }
  }

  // Quick "Sold out" / "Back in stock" switch
  async function toggleAvailable(cake) {
    try {
      await updateCake(cake.id, {
        name: cake.name,
        description: cake.description,
        category: cake.category,
        price: cake.price,
        imageUrl: cake.imageUrl,
        available: !cake.available,   // flip true ↔ false
      });
      loadCakes();
    } catch (err) {
      setError(err.message);
    }
  }

  // Existing categories, offered as suggestions while typing
  const categories = [...new Set(cakes.map((cake) => cake.category))];

  return (
    <div className="admin-section">
      <form className="auth-card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? `Edit cake #${editingId}` : "Add a new cake"}</h3>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <label htmlFor="cake-name">Name</label>
        <input id="cake-name" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="cake-category">Category</label>
        <input id="cake-category" name="category" list="cake-categories" value={form.category}
               onChange={handleChange} placeholder="e.g. Chocolate" required />
        <datalist id="cake-categories">
          {categories.map((c) => <option key={c} value={c} />)}
        </datalist>

        <label htmlFor="cake-price">Price (₹)</label>
        <input id="cake-price" name="price" type="number" min="1" step="1"
               value={form.price} onChange={handleChange} required />

        <label htmlFor="cake-description">Description</label>
        <textarea id="cake-description" name="description" rows={3} maxLength={1000}
                  value={form.description} onChange={handleChange} />

        <label htmlFor="cake-photo">Photo</label>
        <input id="cake-photo" type="file" accept="image/jpeg,image/png,image/webp"
               onChange={handleImageChange} />
        {uploading && <small className="field-hint">Uploading photo...</small>}
        {form.imageUrl && <img className="photo-preview" src={form.imageUrl} alt="Cake preview" />}

        <label htmlFor="cake-image">Or paste an image link</label>
        <input id="cake-image" name="imageUrl" value={form.imageUrl} onChange={handleChange} />

        <label className="check-row">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
          Available (in stock)
        </label>

        <div className="form-buttons">
          <button type="submit" className="auth-button" disabled={saving || uploading}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add cake"}
          </button>
          {editingId && (
            <button type="button" className="filter" onClick={resetForm}>Cancel edit</button>
          )}
        </div>
      </form>

      <div className="order-list">
        {cakes.map((cake) => (
          <div className={cake.available ? "admin-cake" : "admin-cake sold"} key={cake.id}>
            {cake.imageUrl
              ? <img src={cake.imageUrl} alt="" />
              : <span className="admin-cake-emoji" aria-hidden="true">🎂</span>}

            <div className="admin-cake-info">
              <strong>{cake.name}</strong>
              <span>{cake.category} · ₹{cake.price}{!cake.available && " · Sold out"}</span>
            </div>

            <div className="admin-cake-buttons">
              <button className="filter" onClick={() => startEdit(cake)}>Edit</button>
              <button className="filter" onClick={() => toggleAvailable(cake)}>
                {cake.available ? "Mark sold out" : "Back in stock"}
              </button>
              <button className="filter danger" onClick={() => handleDelete(cake)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCakes;
