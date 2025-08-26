// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "./newArrival.css"; // CSS
// // import data from "./data/newArrival.json"; 

// // // import "./Frontend/ProductDetails.css";
// // // import ShopBySabCategries from "./Banner"; // ✅ Add this import

// // const NewArrivals = () => {
// //   const navigate = useNavigate();
// //   const [products, setProducts] = useState([]);

// //   useEffect(() => {
// //     setProducts(data); // Local product data
// //   }, []);

// //   const handleProductClick = (product) => {
// //     navigate(`/product/${product.id}`, { state: { product } });
// //   };

// //   return (
// //     <>
// //       <section className="new-arrival">
// //         <h2>New Arrivals</h2>
// //         <p>Stay ahead of trends with our latest collections</p>
// //         <div className="arrival-list">
// //           {products.map((product) => (
// //             <div key={product.id} className="arrival-item">
// //               <div
// //                 onClick={() => handleProductClick(product)}
// //                 style={{ cursor: "pointer" }}
// //               >
// //                 <img src={product.image} alt={product.name} />
// //                 <p>
// //                   {product.name}
// //                   <br />
// //                   Ready-to-wear
// //                   <br />
// //                   <span className="price">Rs {product.price}</span>
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

      
// //     </>
// //   );
// // };

// // export default NewArrivals;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./newArrival.css"; // CSS
// import data from "./data/newArrival.json"; // JSON data

// const NewArrivals = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     setProducts(data); // Load local product data
//   }, []);

//   const handleProductClick = (product) => {
//     navigate(`/product/${product.id}`, { state: product });
//   };

//   const getMainImage = (product) => {
//     if (Array.isArray(product.images) && product.images.length > 0) {
//       return product.images[0]; // First image from images array
//     } else if (product.image) {
//       return product.image; // Fallback single image
//     } else {
//       return ""; // No image available
//     }
//   };

//   return (
//     <section className="new-arrival">
//       <h2>New Arrivals</h2>
//       <p>Stay ahead of trends with our latest collections</p>

//       <div className="arrival-list">
//         {products.map((product) => (
//           <div key={product.id} className="arrival-item">
//             <div
//               onClick={() => handleProductClick(product)}
//               style={{ cursor: "pointer" }}
//             >
//               <img
//                 src={getMainImage(product)}
//                 alt={product.name}
//                 className="product-image"
//               />
//               <p className="product-info">
//                 {product.name}
//                 <br />
//                 Ready-to-wear
//                 <br />
//                 <span className="price">Rs {product.price}</span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default NewArrivals;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./newArrival.css"; 

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/products/newarrivals");
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  fetchProducts();
}, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const { data } = await axios.get("http://localhost:4000/api/products/newarrivals");
  //       if (data.success) {
  //         setProducts(data.products);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch new arrivals:", err.message);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: product });
  };

  const getMainImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return "";
  };

  return (
    <section className="new-arrival">
      <h2>New Arrivals</h2>
      <p>Stay ahead of trends with our latest collections</p>

      <div className="arrival-list">
        {products.map((product) => (
          <div key={product._id} className="arrival-item">
            <div
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={getMainImage(product)}
                alt={product.name}
                className="product-image"
              />
              <p className="product-info">
                {product.name}
                <br />
                Ready-to-wear
                <br />
                <span className="price">₨ {product.new_price}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
