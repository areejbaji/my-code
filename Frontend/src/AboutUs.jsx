import React from "react";
import "./AboutUs.css" // Import CSS
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
const AboutUs = () => {
  const navigate = useNavigate();
  return ( 
     <div>
       <button onClick={() => navigate(-1)} className="back-button">← Back</button>
    <div className="about-container">
     
      <div className="about-content">
        <h1>Welcome to StyleHub</h1>
        <p className="about-tagline">"Your Fashion, Your Identity"</p>

        <p className="about-description">
          At <strong>StyleHub</strong>, we believe fashion is not just about clothing—it's about self-expression. 
          Our mission is to provide stylish, high-quality, and sustainable fashion for everyone. 
        </p>

        <p className="about-description">
          Whether you're looking for the latest trends, timeless classics, or eco-friendly choices, 
          StyleHub has something for you. We blend fashion with comfort, ensuring you always feel your best.
        </p>

        <div className="about-highlights">
          <div className="highlight-box">
            <h3>Premium Quality</h3>
            <p>Handpicked fabrics ensuring durability and comfort.</p>
          </div>
          <div className="highlight-box">
            <h3>Trendy & Unique</h3>
            <p>Inspired by global fashion trends, made for every personality.</p>
          </div>
          <div className="highlight-box">
            <h3>Sustainable Fashion</h3>
            <p>Eco-friendly materials with ethical production.</p>
          </div>
        </div>

        <button 
           className="explore-button" 
          onClick={() => document.getElementById("products-section").scrollIntoView({ behavior: "smooth" })}
>
               Explore Our Collection
               </button>

      </div>
    </div>
    </div>
  );
};

export default AboutUs;
