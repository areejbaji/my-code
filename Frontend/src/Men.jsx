
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Men.css";
import './WomenPage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenProducts } from './redux/menSlice'; // redux slice import

const Men = () => {
  const suitRef = useRef(null);
  const kurtaRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux se state uthana
  const { products, status, error } = useSelector((state) => state.men);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMenProducts());
    }
  }, [status, dispatch]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter products by subCategory
  const suits = products.filter((p) => p.subCategory === 'suit');
  const kurtas = products.filter((p) => p.subCategory === 'kurta');

  return (
    <div>
      {/* Hero Section */}
      {/* <button onClick={() => navigate(-1)} className="back-button">← Back</button> */}
      <section className="hero-container">
        <div className="hero-content">
          <h1>Welcome to Our Men’s Collection</h1>
          <p>Discover the latest trends and style with our handpicked collection</p>
          {/* <button className="hero-btn">Shop Now</button> */}
        </div>
      </section>

      {/* Categories */}
      <h2 className="category-title">Categories</h2>
      <div className="categories">
        <div onClick={() => scrollToSection(suitRef)}>
          <img src="/assets/mensuit1.webp" alt="Suit" />
          <p>Suit</p>
        </div>
        <div onClick={() => scrollToSection(kurtaRef)}>
          <img src="/assets/kurta1.webp" alt="Kurta" />
          <p>Kurta</p>
        </div>
      </div>

      {/* Loading/Error Handling */}
      {status === 'loading' && <p>Loading products...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {/* Suit Collection */}
      <div className="product-section" ref={suitRef}>
        <h2>Suit Collection</h2>
        <div className="product-grid">
          {suits.map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} state={item}>
              <div className="product-card">
                <img src={item.images[0]} alt={item.name} />
                <h4>{item.name}</h4>
                <p>₨ {item.new_price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Kurta Collection */}
      <div className="product-section" ref={kurtaRef}>
        <h2>Kurta Collection</h2>
        <div className="product-grid">
          {kurtas.map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} state={item}>
              <div className="product-card">
                <img src={item.images[0]} alt={item.name} />
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

export default Men;


