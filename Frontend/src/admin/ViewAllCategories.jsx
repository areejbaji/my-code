import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./ViewAllCategories.css";

const API = "http://localhost:4000/api/admin/categories";

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCat, setEditingCat] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/main`);
      setCategories(data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle subcategories
  const toggleSubcategories = (catId) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  // Edit category
  const handleEditCategory = (cat) => {
    setEditingCat(cat);
    setNewName(cat.name);
    setNewImage(null);
  };

  const submitEditCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (newImage) formData.append("image", newImage);

      await axios.put(`${API}/${editingCat._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category updated successfully");
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  // Edit subcategory
  const handleEditSub = (catId, sub) => {
    setEditingSub({ catId, ...sub });
    setNewName(sub.name);
    setNewImage(null);
  };

  const submitEditSub = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (newImage) formData.append("image", newImage);

      await axios.put(`${API}/${editingSub.catId}/sub/${editingSub._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Subcategory updated successfully");
      setEditingSub(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update subcategory");
    }
  };

  // Delete subcategory
  const deleteSub = async (catId, subId) => {
    if (!window.confirm("Are you sure to delete this subcategory?")) return;
    try {
      await axios.delete(`${API}/${catId}/sub/${subId}`);
      toast.success("Subcategory deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">All Categories</h2>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <React.Fragment key={cat._id}>
              <tr>
                <td>{cat.name}</td>
                <td>{cat.image && <img src={cat.image} alt={cat.name} className="cat-image" />}</td>
                <td>
                  <button onClick={() => handleEditCategory(cat)}>Edit</button>
                  <button onClick={() => deleteCategory(cat._id)}>Delete</button>
                  <button onClick={() => toggleSubcategories(cat._id)}>
                    {expandedCat === cat._id ? "Hide Subcategories" : "Manage Subcategories"}
                  </button>
                </td>
              </tr>

              {/* Edit Category Form */}
              {editingCat && editingCat._id === cat._id && (
                <tr>
                  <td colSpan={3}>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category Name" />
                    <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
                    <button onClick={submitEditCategory}>Save</button>
                  </td>
                </tr>
              )}

              {/* Subcategories */}
              {expandedCat === cat._id && cat.subcategories.length > 0 && (
                <tr className="sub-row">
                  <td colSpan={3}>
                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>Subcategory Name</th>
                          <th>Image</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.subcategories.map((sub) => (
                          <tr key={sub._id}>
                            <td>{sub.name}</td>
                            <td>{sub.image && <img src={sub.image} alt={sub.name} className="sub-image" />}</td>
                            <td>
                              <button onClick={() => handleEditSub(cat._id, sub)}>Edit</button>
                              <button onClick={() => deleteSub(cat._id, sub._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}

                        {/* Edit Subcategory Form */}
                        {editingSub && editingSub.catId === cat._id && (
                          <tr>
                            <td colSpan={3}>
                              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Subcategory Name" />
                              <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
                              <button onClick={submitEditSub}>Save</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllCategories;
