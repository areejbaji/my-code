
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import "./ProductDetailPage.css";

const sizeRanges = {
  S: { Length:[33,35], Waist:[27,29], Hip:[35,37], Shoulder:[15,16], Chest:[35,37], Armhole:[15,17], "Sleeve Length":[21,23], Wrist:[7,9], "Bottom/Damman":[15,17], Knee:[16,18], Thigh:[22,24]},
  M: { Length:[36,38], Waist:[30,32], Hip:[38,40], Shoulder:[16,17], Chest:[38,40], Armhole:[16,18], "Sleeve Length":[22,24], Wrist:[7,9], "Bottom/Damman":[16,18], Knee:[17,19], Thigh:[23,26]},
  L: { Length:[39,41], Waist:[33,35], Hip:[41,43], Shoulder:[17,18], Chest:[41,43], Armhole:[17,19], "Sleeve Length":[23,25], Wrist:[8,10], "Bottom/Damman":[17,19], Knee:[18,20], Thigh:[25,28]},
  XL:{ Length:[42,44], Waist:[36,38], Hip:[44,46], Shoulder:[18,19], Chest:[44,46], Armhole:[18,20], "Sleeve Length":[24,26], Wrist:[8,10], "Bottom/Damman":[18,20], Knee:[19,21], Thigh:[27,30]},
};

const shirtFields   = ["Length","Shoulder","Armhole","Chest","Waist","Hip","Sleeve Length","Wrist","Bottom/Damman"];
const trouserFields = ["Length","Waist","Knee","Thigh","Hip","Bottom"];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [measurements, setMeasurements] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCustom, setShowCustom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showHowTo, setShowHowTo] = useState(true);
  const [howImage, setHowImage] = useState("/assets/how1.webp");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
      } catch (err) {
        setError("Failed to fetch product data. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleMeasurementChange = (field, value) => {
    const num = Number(value);
    const range = (selectedSize && !showCustom) ? sizeRanges[selectedSize]?.[field] : null;
    let error = "";

    if (value === "") {
      error = "This field is required";
    } else if (range && (num < range[0] || num > range[1])) {
      error = `Value must be between ${range[0]} - ${range[1]}`;
    }

    setMeasurements(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const renderTableInputs = fields => (
    fields.map(field => {
      const range = (selectedSize && !showCustom) ? sizeRanges[selectedSize]?.[field] : null;
      return (
        <div className="measurement-group" key={field}>
          <label>{field}</label>
          <input
            type="number"
            placeholder={range ? `${range[0]} - ${range[1]}` : ""}
            value={measurements[field] || ""}
            onChange={e => handleMeasurementChange(field, e.target.value)}
            className={fieldErrors[field] ? "input-error" : ""}
          />
          {fieldErrors[field] && <span className="error-text">{fieldErrors[field]}</span>}
        </div>
      );
    })
  );

const handleAddToCart = () => {
  if (!showCustom && !selectedSize) {
    return alert("⚠️ Please select a size first");
  }

  // size wise stock check
  if (!showCustom && product.stock?.[selectedSize] <= 0) {
    return alert(`${selectedSize} size is out of stock`);
  }
  if (showCustom && product.customStock <= 0) {
    return alert("Custom size is out of stock");
  }

  const allRequired = [...shirtFields, ...trouserFields];
  for (let f of allRequired) {
    if (!measurements[f] || measurements[f] === "") {
      return alert("⚠️ Please fill all measurement fields");
    }
    if (fieldErrors[f]) {
      return alert("⚠️ Please correct the measurement values");
    }
  }

  if (quantity > 5) return alert("⚠️ You can only order max 5 items.");

  dispatch(addToCart({
    id: Date.now(),
    productId: product._id,
    name: product.name,
    price: product.new_price,
    image: selectedImage,
    size: showCustom ? "Custom" : selectedSize,
    measurements,
    quantity,
    stock: showCustom ? product.customStock : product.stock?.[selectedSize] || 0 
  }));

  alert("✅ Item added to cart!");
};


  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  const sizes = ["S", "M", "L", "XL"];
  const allOutOfStock = sizes.every(size => product.stock?.[size] <= 0) && product.customStock <= 0;

  return (
    <div className="product-detail-page">
      <button onClick={() => window.history.back()} className="back-button">← Back</button>

      <div className="main-layout">
        {/* Left - Thumbnails */}
        <div className="thumbnails-section">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              className={img === selectedImage ? "active" : ""}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        {/* Center - Main Image */}
        <div className="image-section">
          <img className="main-image" src={selectedImage} alt={product.name} />
        </div>

        {/* Right - Product Info */}
        <div className="info-section">
          <h2>{product.name}</h2>
          <p className="price">
            {product.old_price && <span className="old-price">₨ {product.old_price}</span>}
            <span className="new-price">₨ {product.new_price}</span>
          </p>
          {selectedSize && (
            <p className={`stock-info ${product.stock?.[selectedSize] > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock?.[selectedSize] > 0 ? "In Stock" : "Out of Stock"}
            </p>
          )}

          {/* Sizes */}
          <div className="size-section">
            <h3>Select Size:</h3>
            <div className="size-buttons">
              {sizes.map(size => {
                const inStock = product.stock?.[size] > 0;
                return (
                  <button
                    key={size}
                    disabled={!inStock}
                    className={`${selectedSize === size ? "selected" : ""} ${!inStock ? "out-of-stock" : ""}`}
                    onClick={() => { setSelectedSize(size); setShowCustom(false); setMeasurements({}); setFieldErrors({}); }}
                  >
                    {size}
                  </button>
                );
              })}
              <button
                disabled={product.customStock <= 0}
                className={`${showCustom ? "selected" : ""} ${product.customStock <= 0 ? "out-of-stock" : ""}`}
                onClick={() => { setShowCustom(true); setSelectedSize(""); setMeasurements({}); setFieldErrors({}); }}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Measurements */}
      {(selectedSize || showCustom) && (
        <div className="measurements-container">
          <div className="measurements-left">
            <h3>{showCustom ? "Customize Your Measurements" : "Standard Measurements"}</h3>
            <div className="shirt-section">
              <h4>Shirt Measurements</h4>
              <div className="fields-grid">{renderTableInputs(shirtFields)}</div>
            </div>
            <div className="trouser-section">
              <h4>Trouser Measurements</h4>
              <div className="fields-grid">{renderTableInputs(trouserFields)}</div>
            </div>
          </div>

          {/* How to Measure */}
          <div className="how-to-container">
            <h3 onClick={() => setShowHowTo(!showHowTo)}>How to Measure {showHowTo ? "-" : "+"}</h3>
            {showHowTo && (
              <div className="how-images">
                <button className="how-arrow" onClick={() => setHowImage(prev => prev === "/assets/how1.webp" ? "/assets/how2.webp" : "/assets/how1.webp")}>&#8249;</button>
                <img src={howImage} className="how-main-image" alt="how to measure"/>
                <button className="how-arrow" onClick={() => setHowImage(prev => prev === "/assets/how1.webp" ? "/assets/how2.webp" : "/assets/how1.webp")}>&#8250;</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="cart-section-below">
        <div className="quantity-container">
          <button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
          <input value={quantity} readOnly />
          <button onClick={() => setQuantity(q => Math.min(5, q+1))}>+</button>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={allOutOfStock || (!showCustom && !selectedSize)}
        >
          {allOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* Description */}
      <div className="description-section">
        <h3>Product Description</h3>
        {Array.isArray(product.description) ? (
          <ul>
            {product.description.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        ) : (
          <p>{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

