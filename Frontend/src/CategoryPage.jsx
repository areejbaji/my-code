


import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const subRefs = useRef({});

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);

        const categoryRes = await axios.get(
          `http://localhost:4000/api/categories/${slug}`
        );
        setCategory(categoryRes.data);

       
        const categoryNameLower = categoryRes.data.name.toLowerCase();
        const productsRes = await axios.get(
          `http://localhost:4000/api/products/category/${categoryNameLower}`
        );
        setProducts(productsRes.data);

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch category or products");
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  const scrollToSub = (subSlug) => {
    if (subRefs.current[subSlug]) {
      subRefs.current[subSlug].scrollIntoView({ behavior: "smooth" });
    }
  };

  const productsBySub = {};
  category?.subcategories.forEach((sub) => {
    productsBySub[sub.slug] = products.filter(
      (p) => p.subCategory.toLowerCase() === sub.name.toLowerCase()
    );
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      
     
      <section
        className="hero-container"
        style={{
          backgroundImage: `url(${
            category?.slug === "men"
              ? "/assets/men.webp"
              : category?.slug === "women"
              ? "/assets/women.webp"
              : "/assets/default-hero.jpg"
          })`,
        }}
      >
        <div className="hero-content">
          <h1>{category?.name}</h1>
          <p>Explore our collection of {category?.name}</p>
        </div>
      </section>

      <div className="subcategories-section">
        <h2>Subcategories</h2>
        <div className="subcategories-container">
          {category?.subcategories.map((sub) => (
            <div
              key={sub._id}
              className="subcategory-card"
              onClick={() => scrollToSub(sub.slug)}
            >
              <img src={sub.image} alt={sub.name} />
              <p>{sub.name}</p>
            </div>
          ))}
        </div>
      </div>

      {category?.subcategories.map((sub) => (
        <div
          key={sub._id}
          ref={(el) => (subRefs.current[sub.slug] = el)}
          className="product-section"
        >
          <h2>{sub.name} Collection</h2>
          <div className="product-grid">
            {productsBySub[sub.slug]?.length > 0 ? (
              productsBySub[sub.slug].map((p) => (
                <Link to={`/product/${p._id}`} state={p} key={p._id}>
                  <div className="product-card">
                    <img src={p.images[0]} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p>₨ {p.new_price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No products in this subcategory</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;

