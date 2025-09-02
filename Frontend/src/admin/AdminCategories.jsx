import React, { useEffect, useState } from "react";
import apis from "../utils/apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Add form state
  const [catName, setCatName] = useState("");
  const [subs, setSubs] = useState([""]);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSubs, setEditSubs] = useState([""]);
  const [saving, setSaving] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
    "Content-Type": "application/json",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().getCategories, { headers: headers() });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json(); // expect: [{_id, name, subcategories:[{_id,name}]}]
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ---------- Add ----------
  const addSubField = () => setSubs((p) => [...p, ""]);
  const removeSubField = (i) => setSubs((p) => p.filter((_, idx) => idx !== i));
  const updateSubVal = (i, val) => setSubs((p) => p.map((s, idx) => (idx === i ? val : s)));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return toast.error("Category name required");
    const payload = {
      name: catName.trim(),
      subcategories: subs.filter(Boolean).map((name) => ({ name: name.trim() })),
    };

    try {
      setSaving(true);
      const res = await fetch(apis().addCategory, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");
      toast.success("Category added!");
      setCatName("");
      setSubs([""]);
      await fetchCategories();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Edit ----------
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name || "");
    setEditSubs((cat.subcategories || []).map((s) => s.name) || [""]);
    if ((cat.subcategories || []).length === 0) setEditSubs([""]);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditSubs([""]);
  };

  const addEditSub = () => setEditSubs((p) => [...p, ""]);
  const removeEditSub = (i) => setEditSubs((p) => p.filter((_, idx) => idx !== i));
  const updateEditSubVal = (i, val) => setEditSubs((p) => p.map((s, idx) => (idx === i ? val : s)));

  const saveEdit = async () => {
    if (!editName.trim()) return toast.error("Category name required");
    const payload = {
      name: editName.trim(),
      subcategories: editSubs.filter(Boolean).map((name) => ({ name: name.trim() })),
    };

    try {
      setSaving(true);
      const res = await fetch(apis().updateCategory(editId), {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      toast.success("Category updated");
      cancelEdit();
      await fetchCategories();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(apis().deleteCategory(id), {
        method: "DELETE",
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      toast.success("Category deleted");
      setCategories((p) => p.filter((c) => c._id !== id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="cat-loading">Loading categories…</div>;
  if (error) return <div className="cat-error">Error: {error}</div>;

  return (
    <div className="cat-page">
      <header className="cat-header">
        <h2>Manage Categories</h2>
      </header>

      {/* Add Card */}
      <section className="card">
        <h3>Add Category</h3>
        <form onSubmit={handleAdd} className="cat-form">
          <div className="form-row">
            <label>Category Name</label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g., Men"
              required
            />
          </div>

          <div className="form-row">
            <label>Subcategories</label>
            <div className="sub-list">
              {subs.map((s, idx) => (
                <div className="sub-item" key={idx}>
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => updateSubVal(idx, e.target.value)}
                    placeholder={`Subcategory #${idx + 1}`}
                  />
                  {subs.length > 1 && (
                    <button type="button" className="btn btn-light" onClick={() => removeSubField(idx)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={addSubField}>
                + Add Subcategory
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </section>

      {/* List Card */}
      <section className="card">
        <h3>All Categories</h3>

        <div className="table-wrap">
          <table className="cat-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subcategories</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editId === cat._id;
                return (
                  <tr key={cat._id}>
                    {/* Name cell */}
                    <td>
                      {!isEditing ? (
                        <span className="cat-name">{cat.name}</span>
                      ) : (
                        <input
                          className="edit-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Category name"
                        />
                      )}
                    </td>

                    {/* Subcategories cell */}
                    <td>
                      {!isEditing ? (
                        <div className="badges">
                          {(cat.subcategories || []).map((s) => (
                            <span className="badge" key={s._id || s.name}>{s.name}</span>
                          ))}
                          {(!cat.subcategories || cat.subcategories.length === 0) && (
                            <span className="muted">—</span>
                          )}
                        </div>
                      ) : (
                        <div className="sub-list">
                          {editSubs.map((s, idx) => (
                            <div className="sub-item" key={idx}>
                              <input
                                className="edit-input"
                                value={s}
                                onChange={(e) => updateEditSubVal(idx, e.target.value)}
                                placeholder={`Subcategory #${idx + 1}`}
                              />
                              {editSubs.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => removeEditSub(idx)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button type="button" className="btn btn-outline" onClick={addEditSub}>
                            + Add Subcategory
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="actions">
                      {!isEditing ? (
                        <>
                          <button className="btn btn-sm" onClick={() => startEdit(cat)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-primary" onClick={saveEdit} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button className="btn btn-sm btn-light" onClick={cancelEdit}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted" style={{ textAlign: "center" }}>
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default AdminCategories;
