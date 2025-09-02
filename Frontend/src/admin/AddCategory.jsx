import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AddCategory.css";

const API = "http://localhost:4000/api/admin/categories";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subImage, setSubImage] = useState(null);

  // Add subcategory to list
  const addSubcategory = () => {
    if (!subName) return toast.error("Enter subcategory name");
    setSubcategories([...subcategories, { name: subName, image: subImage }]);
    setSubName("");
    setSubImage(null);
  };

  // Remove subcategory
  const removeSubcategory = (index) => {
    const updated = [...subcategories];
    updated.splice(index, 1);
    setSubcategories(updated);
  };

  // Submit category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const res = await axios.post(`${API}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const catId = res.data.category._id;

      // Add subcategories one by one
      for (let sub of subcategories) {
        const subForm = new FormData();
        subForm.append("name", sub.name);
        if (sub.image) subForm.append("image", sub.image);
        await axios.post(`${API}/${catId}/sub`, subForm, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      toast.success("Category added successfully!");
      setName("");
      setImage(null);
      setSubcategories([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="add-cat-container">
      <ToastContainer />
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit} className="add-cat-form">
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group">
          <label>Category Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Subcategory Section */}
        <div className="subcat-section">
          <h3>Add Subcategories</h3>
          <div className="subcat-inputs">
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="Subcategory name"
            />
            <input
              type="file"
              onChange={(e) => setSubImage(e.target.files[0])}
            />
            <button type="button" onClick={addSubcategory}>Add Subcategory</button>
          </div>

          {/* List of added subcategories */}
          {subcategories.length > 0 && (
            <ul className="subcat-list">
              {subcategories.map((sub, index) => (
                <li key={index}>
                  {sub.name} {sub.image && <span>(Image attached)</span>}
                  <button type="button" onClick={() => removeSubcategory(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="submit-btn">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
