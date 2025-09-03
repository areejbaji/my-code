
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./ViewAllCategories.css";

// ✅ Axios instance with admin token
const token = localStorage.getItem("adminToken"); // Admin JWT token
const API = axios.create({
  baseURL: "http://localhost:4000/api/admin",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState(null);

  const [editingCat, setEditingCat] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatImage, setEditingCatImage] = useState(null);

  const [newSubName, setNewSubName] = useState("");
  const [newSubImage, setNewSubImage] = useState(null);

  const [editingSub, setEditingSub] = useState(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [editingSubImage, setEditingSubImage] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories/main");
      setCategories(data);
    } catch (err) {
      console.error(err);
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

  // ------------------- CATEGORY -------------------
  const addCategory = async () => {
    if (!newCatName) return toast.error("Enter category name");
    try {
      const formData = new FormData();
      formData.append("name", newCatName);
      if (newCatImage) formData.append("image", newCatImage);

      await API.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category added successfully");
      setNewCatName("");
      setNewCatImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  const editCategory = (cat) => {
    setEditingCat(cat);
    setEditingCatName(cat.name);
    setEditingCatImage(null);
  };

  const updateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingCatName);
      if (editingCatImage) formData.append("image", editingCatImage);

      await API.put(`/categories/${editingCat._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category updated");
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  // ------------------- SUBCATEGORY -------------------
  const addSubcategory = async (catId) => {
    if (!newSubName) return toast.error("Enter subcategory name");
    try {
      const formData = new FormData();
      formData.append("name", newSubName);
      if (newSubImage) formData.append("image", newSubImage);

      await API.post(`/categories/${catId}/sub`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Subcategory added");
      setNewSubName("");
      setNewSubImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subcategory");
    }
  };

  const editSubcategory = (catId, sub) => {
    setEditingSub({ catId, ...sub });
    setEditingSubName(sub.name);
    setEditingSubImage(null);
  };

  const updateSubcategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingSubName);
      if (editingSubImage) formData.append("image", editingSubImage);

      await API.put(`/categories/${editingSub.catId}/sub/${editingSub._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Subcategory updated");
      setEditingSub(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subcategory");
    }
  };

  const deleteSubcategory = async (catId, subId) => {
    if (!window.confirm("Are you sure to delete this subcategory?")) return;
    try {
      await API.delete(`/categories/${catId}/sub/${subId}`);
      toast.success("Subcategory deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Add New Category */}
      <div className="add-category">
        <input type="text" placeholder="New category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
        <input type="file" onChange={(e) => setNewCatImage(e.target.files[0])} />
        <button onClick={addCategory}>Add Category</button>
      </div>

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
                  <button onClick={() => editCategory(cat)}>Edit</button>
                  <button onClick={() => deleteCategory(cat._id)}>Delete</button>
                  <button onClick={() => toggleSubcategories(cat._id)}>
                    {expandedCat === cat._id ? "Hide Subcategories" : "Manage Subcategories"}
                  </button>
                </td>
              </tr>

              {/* Edit Category */}
              {editingCat && editingCat._id === cat._id && (
                <tr>
                  <td colSpan={3}>
                    <input type="text" value={editingCatName} onChange={(e) => setEditingCatName(e.target.value)} />
                    <input type="file" onChange={(e) => setEditingCatImage(e.target.files[0])} />
                    <button onClick={updateCategory}>Save</button>
                    <button onClick={() => setEditingCat(null)}>Cancel</button>
                  </td>
                </tr>
              )}

              {/* Subcategories */}
              {expandedCat === cat._id && (
                <tr>
                  <td colSpan={3}>
                    {/* Add Subcategory */}
                    <div className="add-subcategory">
                      <input type="text" placeholder="New subcategory" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} />
                      <input type="file" onChange={(e) => setNewSubImage(e.target.files[0])} />
                      <button onClick={() => addSubcategory(cat._id)}>Add Subcategory</button>
                    </div>

                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>Name</th>
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
                              <button onClick={() => editSubcategory(cat._id, sub)}>Edit</button>
                              <button onClick={() => deleteSubcategory(cat._id, sub._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}

                        {/* Edit Subcategory */}
                        {editingSub && editingSub.catId === cat._id && (
                          <tr>
                            <td colSpan={3}>
                              <input type="text" value={editingSubName} onChange={(e) => setEditingSubName(e.target.value)} />
                              <input type="file" onChange={(e) => setEditingSubImage(e.target.files[0])} />
                              <button onClick={updateSubcategory}>Save</button>
                              <button onClick={() => setEditingSub(null)}>Cancel</button>
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
