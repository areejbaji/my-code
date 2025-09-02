import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  // Handle category image upload (Cloudinary)
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  const addSubcategory = () => {
    setSubcategories([...subcategories, { name: "", image: null }]);
  };

  const handleSubcategoryChange = (index, field, value) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Upload category image
    const categoryImgUrl = categoryImage
      ? await handleImageUpload(categoryImage)
      : "";

    // Upload subcategories images
    const subcategoriesWithUrls = await Promise.all(
      subcategories.map(async (sub) => {
        let imgUrl = "";
        if (sub.image) {
          imgUrl = await handleImageUpload(sub.image);
        }
        return { name: sub.name, image: imgUrl };
      })
    );

    // Send to backend
    await axios.post("http://localhost:4000/api/categories", {
      name: categoryName,
      image: categoryImgUrl,
      subcategories: subcategoriesWithUrls,
    });

    alert("✅ Category with subcategories added!");
    setCategoryName("");
    setCategoryImage(null);
    setSubcategories([]);
  };

  return (
    <div className="add-category">
      <h2>Add New Category</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category Image</label>
          <input
            type="file"
            onChange={(e) => setCategoryImage(e.target.files[0])}
            required
          />
        </div>

        <h3>Subcategories</h3>
        {subcategories.map((sub, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Subcategory Name"
              value={sub.name}
              onChange={(e) =>
                handleSubcategoryChange(index, "name", e.target.value)
              }
              required
            />
            <input
              type="file"
              onChange={(e) =>
                handleSubcategoryChange(index, "image", e.target.files[0])
              }
              required
            />
          </div>
        ))}

        <button type="button" onClick={addSubcategory}>
          ➕ Add Subcategory
        </button>

        <br />
        <button type="submit">Save Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
