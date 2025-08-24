
import { useNavigate } from "react-router-dom";
import "./Home.css";

import p15 from "./assets/p15_img.webp";
import womenCat from "./assets/p69_img.jpg";
import menCat from "./assets/men8.jpg";

import p77 from "./assets/p70_img.webp";
import p2_img from "./assets/p2_img.webp";
import p3_img from "./assets/p3_img.webp";
import p72_img from "./assets/p72_img.webp";
import men10 from "./assets/men10.jpg";
import men9 from "./assets/men9.jpg";
import men11 from "./assets/men11.jpg";
import men7 from "./assets/men7.jpg";
import NewArrivals from "./NewArrival";
import Catagory from "./Catagory";
import Hero from "./Hero";
import PromoBanner from "./Banner";

const Home = () => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate("/product-detail", { state: product });
  };

  const handleAddToCart = (product) => {
    alert(`Added "${product.name}" to cart.`);
  };

  const products = [
    { id: 1, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: p77 },
    { id: 2, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: p2_img },
    { id: 3, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: p3_img },
    { id: 4, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: p72_img },
    { id: 5, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: men10 },
    { id: 6, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: men9 },
    { id: 7, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: men11 },
    { id: 8, name: "Viola - Stitched 3pc", price: "Rs 2,500", img: men7 },
  ];

  return (
    <div>
      <Hero/>
      {/* Hero Section */}
      {/* <div className="hero">
        <div className="hero-text">
          <h2>Fashion That Defines You</h2>
          <p>
            Elevate your wardrobe with StyleHub’s meticulously curated
            selections. From timeless classics to avant-garde trends, we offer
            unparalleled quality and style for the discerning fashion
            enthusiast.
          </p>
          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>
        <div className="hero-image">
          <img src={p15} alt="Fashion Models" />
        </div>
      </div> */}
      <Catagory/>
      {/* Category Section
      <div className="categories">
        <h2>Shop by Categories</h2>
        <div className="category-list">
          <div className="category-item" onClick={() => navigate("/women")}>
            <img src={womenCat} alt="Women" />
            <p>Women</p>
          </div>
          <div className="category-item" onClick={() => navigate("/men")}>
            <img src={menCat} alt="Men" />
            <p>Men</p>
          </div>
        </div>
      </div> */}
        <NewArrivals/>
      {/* New Arrivals Section */}
      {/* <section className="new-arrival">
        <h2>New Arrivals</h2>
        <p>Stay ahead of trends with our latest collections</p>
        <div className="arrival-list">
          {products.map((product) => (
            <div key={product.id} className="arrival-item">
              <div
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <img src={product.img} alt={product.name} />
                <p>
                  {product.name}
                  <br />
                  Ready-to-wear
                  <br />
                  <span className="price">{product.price}</span>
                </p>
              </div>
              <button
                className="buy-btn"
                onClick={() => handleAddToCart(product)}
              >
                👜 Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section> */}
      <PromoBanner/>
    </div>
  );
};

export default Home;



