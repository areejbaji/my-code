


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./AddProduct.css";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "men",
//     subCategory: "suit",
//     new_price: "",
//     old_price: "",
//     description: "",
//     customStock: 10,
//     stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
//   });

//   const [images, setImages] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (["S", "M", "L", "XL", "XXL"].includes(name)) {
//       setFormData(prev => ({
//         ...prev,
//         stock: { ...prev.stock, [name]: Math.max(0, Number(value)) }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     console.log("Selected images:", files);
//     setImages(prev => [...prev, ...files]);
//   };

//   const removeImage = (index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (images.length === 0) {
//         alert("Please select at least one image!");
//         return;
//       }

//       const token = localStorage.getItem("adminToken");
//       const data = new FormData();

//       data.append("name", formData.name);
//       data.append("category", formData.category);
//       data.append("subCategory", formData.subCategory);
//       data.append("new_price", formData.new_price);
//       data.append("old_price", formData.old_price);
//       data.append("description", formData.description);
//       data.append("customStock", formData.customStock);
//       data.append("stock", JSON.stringify(formData.stock));
//       images.forEach(img => data.append("images", img));

//       // Debug: log all FormData entries
//       for (let pair of data.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await axios.post(
//         "http://localhost:4000/api/admin/products",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//           },
//           timeout: 20000, // 20 seconds in case image upload takes longer
//         }
//       );

//       console.log("Server response:", response.data);
//       alert("Product added successfully!");
//       navigate("/admin/products");
//     } catch (error) {
//       console.error("Error adding product:", error.response?.data || error);
//       alert("Failed to add product. Check console for details.");
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>Add New Product</h2>
//       <form onSubmit={handleSubmit} className="add-product-form">
//         <label>
//           Name:
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </label>

//         <label>
//           Category:
//           <select name="category" value={formData.category} onChange={handleChange}>
//             <option value="men">Men</option>
//             <option value="women">Women</option>
//           </select>
//         </label>

//         <label>
//           SubCategory:
//           <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
//             <option value="suit">Suit</option>
//             <option value="kurta">Kurta</option>
//             <option value="frock">Frock</option>
//           </select>
//         </label>

//         <label>
//           New Price:
//           <input type="number" name="new_price" value={formData.new_price} onChange={handleChange} required />
//         </label>

//         <label>
//           Old Price:
//           <input type="number" name="old_price" value={formData.old_price} onChange={handleChange} />
//         </label>

//         <label>
//           Description:
//           <textarea name="description" value={formData.description} onChange={handleChange} rows={5} />
//         </label>

//         <label>
//           Images:
//           <input type="file" multiple accept="image/*" onChange={handleImageChange} />
//         </label>

//         {images.length > 0 && (
//           <div className="image-preview">
//             {images.map((img, index) => (
//               <div key={index} className="preview-item">
//                 <img src={URL.createObjectURL(img)} alt={`img-${index}`} />
//                 <span className="remove-btn" onClick={() => removeImage(index)}>×</span>
//               </div>
//             ))}
//           </div>
//         )}

//         <fieldset>
//           <legend>Stock</legend>
//           {["S","M","L","XL","XXL"].map(size => (
//             <label key={size}>
//               {size}:
//               <input type="number" name={size} value={formData.stock[size]} min="0" onChange={handleChange} />
//             </label>
//           ))}
//         </fieldset>

//         <label>
//           Custom Stock:
//           <input type="number" name="customStock" value={formData.customStock} min="0" onChange={handleChange} />
//         </label>

//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "men",
    subCategory: "suit",
    new_price: "",
    old_price: "",
    description: "",
    customStock: 10,
    stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    if (["S", "M", "L", "XL", "XXL"].includes(name)) {
      setFormData(prev => ({ ...prev, stock: { ...prev.stock, [name]: Math.max(0, Number(value)) } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = e => {
    setImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = index => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async e => {
    e.preventDefault();
    if (images.length === 0) return alert("Please select at least one image!");

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("new_price", formData.new_price);
      data.append("old_price", formData.old_price);
      data.append("description", formData.description);
      data.append("customStock", formData.customStock);
      data.append("stock", JSON.stringify(formData.stock));
      images.forEach(img => data.append("images", img));

      const response = await axios.post(
        "http://localhost:4000/api/admin/products",
        data,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          timeout: 20000,
        }
      );

      console.log("Server response:", response.data);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert("Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>
          Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </label>

        <label>
          SubCategory:
          <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
            <option value="suit">Suit</option>
            <option value="kurta">Kurta</option>
            <option value="frock">Frock</option>
          </select>
        </label>

        <label>New Price: <input type="number" name="new_price" value={formData.new_price} onChange={handleChange} required /></label>
        <label>Old Price: <input type="number" name="old_price" value={formData.old_price} onChange={handleChange} /></label>
        <label>Description: <textarea name="description" value={formData.description} onChange={handleChange} rows={5} /></label>
        <label>Images: <input type="file" multiple accept="image/*" onChange={handleImageChange} /></label>

        {images.length > 0 && (
          <div className="image-preview">
            {images.map((img, i) => (
              <div key={i} className="preview-item">
                <img src={URL.createObjectURL(img)} alt={`img-${i}`} />
                <span className="remove-btn" onClick={() => removeImage(i)}>×</span>
              </div>
            ))}
          </div>
        )}

        <fieldset>
          <legend>Stock</legend>
          {["S","M","L","XL","XXL"].map(size => (
            <label key={size}>{size}: <input type="number" name={size} value={formData.stock[size]} min="0" onChange={handleChange} /></label>
          ))}
        </fieldset>

        <label>Custom Stock: <input type="number" name="customStock" value={formData.customStock} min="0" onChange={handleChange} /></label>

        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
