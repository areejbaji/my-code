
// import React, { useRef } from 'react';
// import { Link } from 'react-router-dom';
// import data from './data/womenProducts.json';
// import './WomenPage.css';

// const WomenPage = () => {
//   const suitRef = useRef(null);
//   const frockRef = useRef(null);

//   const scrollToSection = (ref) => {
//     ref.current.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div>
//       {/* Hero */}
//       <div
//         className="hero"
//         style={{ backgroundImage: `url("/assets/herowo.webp")` }}
//       >
//         Women Collection
//       </div>

//       {/* Categories */}
//        <h2 className="category-title">Categories</h2>
//       <div className="categories">

//         <div onClick={() => scrollToSection(suitRef)}>
//           <img src="/assets/womenc.webp" alt="Suit" />
//           <p>Suit</p>
//         </div>
//         <div onClick={() => scrollToSection(frockRef)}>
//           <img src="/assets/frockc.jpg" alt="Frock" />
//           <p>Frock</p>
//         </div>
//       </div>

//       {/* Suits */}
//       <div className="product-section" ref={suitRef}>
//         <h2>Suit Collection</h2>
//         <div className="product-grid">
//           {data.suits.map((item) => (
//             <Link to={`/product/${item.id}`} key={item.id} state={item}>
//               <div className="product-card">
//                 {/* <img src={item.image} alt={item.name} /> */}
//                 <img
//                 src={item.image || (item.images && item.images[0])}
//                              alt={item.name}/>

//                 <h4>{item.name}</h4>
//                 <p>₨ {item.price}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Frocks */}
//       {/* Frocks */}
// <div className="product-section" ref={frockRef}>
//   <h2>Frock Collection</h2>
//   <div className="product-grid">
//     {data.frocks.map((item) => (
//       <Link to={`/product/${item.id}`} key={item.id} state={item}>
//         <div className="product-card">
//           <img src={item.image || (item.images && item.images[0])} alt={item.name} />
//           <h4>{item.name}</h4>
//           <p>₨ {item.price}</p>
//         </div>
//       </Link>
//     ))}
//   </div>
// </div>

//     </div>
//   );
// };

// export default WomenPage;

// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWomenProducts } from "./redux/womenSlice"; 
// import { Link } from "react-router-dom";
// import "./WomenPage.css";

// const WomenPage = () => {
//   const dispatch = useDispatch();
//   const { suits, frocks, status } = useSelector((state) => state.women);

//   const suitRef = useRef(null);
//   const frockRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchWomenProducts());
//   }, [dispatch]);

//   const scrollToSection = (ref) => {
//     ref.current.scrollIntoView({ behavior: "smooth" });
//   };

//   if (status === "loading") {
//     return <p style={{ textAlign: "center" }}>Loading women products...</p>;
//   }

//   return (
//     <div>
//       {/* Hero */}
//       <div
//         className="hero"
//         style={{ backgroundImage: `url("/assets/herowo.webp")` }}
//       >
//         Women Collection
//       </div>

//       {/* Categories */}
//       <h2 className="category-title">Categories</h2>
//       <div className="categories">
//         <div onClick={() => scrollToSection(suitRef)}>
//           <img src="/assets/womenc.webp" alt="Suit" />
//           <p>Suit</p>
//         </div>
//         <div onClick={() => scrollToSection(frockRef)}>
//           <img src="/assets/frockc.jpg" alt="Frock" />
//           <p>Frock</p>
//         </div>
//       </div>

//       {/* Suits */}
//       <div className="product-section" ref={suitRef}>
//         <h2>Suit Collection</h2>
//         <div className="product-grid">
//           {suits.map((item) => (
//             <Link to={`/product/${item.id}`} key={item.id} state={item}>
//               <div className="product-card">
//                 <img
//                   src={item.image || (item.images && item.images[0])}
//                   alt={item.name}
//                 />
//                 <h4>{item.name}</h4>
//                 <p>₨ {item.price}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Frocks */}
//       <div className="product-section" ref={frockRef}>
//         <h2>Frock Collection</h2>
//         <div className="product-grid">
//           {frocks.map((item) => (
//             <Link to={`/product/${item.id}`} key={item.id} state={item}>
//               <div className="product-card">
//                 <img
//                   src={item.image || (item.images && item.images[0])}
//                   alt={item.name}
//                 />
//                 <h4>{item.name}</h4>
//                 <p>₨ {item.price}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WomenPage;
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
  // same styling reuse
import "./WomenPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchWomenProducts } from './redux/womenSlice'; // slice import

const Women = () => {
  const suitRef = useRef(null);
  const frockRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux se state
  const { products, status, error } = useSelector((state) => state.women);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWomenProducts());
    }
  }, [status, dispatch]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter by subCategory
  const suits = products.filter((p) => p.subCategory === 'suit');
  const frocks = products.filter((p) => p.subCategory === 'frock');

  return (
    <div>
      {/* Hero Section */}
      {/* <button onClick={() => navigate(-1)} className="back-button">← Back</button> */}
      {/* <section className="hero-container">
        <div className="hero-content">
          
          <h1>Welcome to Our Women’s Collection</h1>
          <p>Explore the latest Suits & Frocks crafted with elegance</p>
          <button className="hero-btn">Shop Now</button>
          
        </div>
      </section> */}
      {/* <div
        className="hero"
        style={{ backgroundImage: `url("/assets/banar pages.webp")` }}

      >
       
      
      </div> */}
      <section className="hero-section" >
        <div className="hero-content">
          <h3>Welcome to Our Women's Collection</h3>
          {/* <p>Discover the latest trends and style with our handpicked collection</p> */}
          {/* <button className="hero-btn">Shop Now</button> */}
        </div>
      </section>

      {/* Categories */}
      <h2 className="category-title">Sub Categories</h2>
      <div className="categories">
        <div onClick={() => scrollToSection(suitRef)}>
          <img src="/assets/womenc.webp" alt="Suit" />
          <p>Suit</p>
        </div>
        <div onClick={() => scrollToSection(frockRef)}>
          <img src="/assets/frockc.jpg" alt="Frock" />
          <p>Frock</p>
        </div>
      </div>

      {/* Loading/Error */}
      {status === 'loading' && <p>Loading products...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {/* Suit Collection */}
      <div className="product-section" ref={suitRef}>
        <h2>Suit Collection</h2>
        <div className="product-grid">
          {suits.map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} state={item}>
              <div className="product-card">
                <img src={item.images?.[0]} alt={item.name} />
                <h4>{item.name}</h4>
                <p>₨ {item.new_price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Frock Collection */}
      <div className="product-section" ref={frockRef}>
        <h2>Frock Collection</h2>
        <div className="product-grid">
          {frocks.map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} state={item}>
              <div className="product-card">
                <img src={item.images?.[0]} alt={item.name} />
                <h4>{item.name}</h4>
                <p>₨ {item.new_price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Women;

