
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ViewAllProducts.css";

// const ViewAllProducts = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:4000/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Error fetching products:", err));
//   }, []);

//   const handleEdit = (id) => {
//     alert(`Edit button clicked for Product ID: ${id}`);
//     // later: navigate to edit form page
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       axios
//         .delete(`http://localhost:4000/api/products/${id}`)
//         .then(() => {
//           setProducts(products.filter((p) => p._id !== id));
//         })
//         .catch((err) => console.error("Error deleting product:", err));
//     }
//   };

//   return (
//     <div className="products-container">
//       <h2>All Products</h2>
//       <table className="products-table">
//         <thead>
//           <tr>
               <th>Sr#</th>
//             <th>Image</th>
//             <th>Name</th>
//             <th>Category / SubCategory</th>
//             <th> Price</th>
//             <th>New Price</th>
//             <th>Status</th>

//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.length > 0 ? (
//             products.map((product) => (
//               <tr key={product._id}>
//                 <td>
//                   <img
//                     src={product.images[0]}
//                     alt={product.name}
//                     className="product-img"
//                   />
//                 </td>
//                 <td>{product.name}</td>
//                 <td>
//                   {product.category} / {product.subCategory}
//                 </td>
//                 <td>Rs {product.old_price || "-"}</td>
//                 <td>Rs {product.new_price}</td>
//                 <td>{product.available ? "Available" : "Out of Stock"}</td>
//                 <td>{new Date(product.dateAdded).toLocaleDateString()}</td>
//                 <td>
//                   <button
//                     className="btn-edit"
//                     onClick={() => handleEdit(product._id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn-delete"
//                     onClick={() => handleDelete(product._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8">No products found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewAllProducts;
// ViewAllProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAllProducts.css";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (id) => {
    alert(`Edit form will open for product ID: ${id}`);
    // later: navigate(`/edit-product/${id}`)
  };

  return (
    <div className="view-products-container">
      <h2>All Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Sr#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Sub-Category</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id}>
                
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.subCategory}</td>
                <td>{product.new_price}</td>
                <td>{product.old_price || "-"}</td>
                <td>{product.available ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllProducts;
