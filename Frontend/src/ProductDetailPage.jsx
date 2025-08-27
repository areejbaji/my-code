



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { addToCart } from "./redux/cartSlice";
// import "./ProductDetailPage.css";

// const sizeRanges = {
//   XS: { Length: [30,32], Waist:[24,26], Hip:[34,36], Shoulder:[14,15], Chest:[32,34], Armhole:[14,16], 'Sleeve Length':[20,22], Wrist:[7,9], 'Bottom/Damman':[14,16], Knee:[15,17], Thigh:[20,22],Bottom:[14,16]},
//   S:  { Length:[33,35], Waist:[27,29], Hip:[35,37], Shoulder:[15,16], Chest:[35,37], Armhole:[15,17], 'Sleeve Length':[21,23], Wrist:[7,9], 'Bottom/Damman':[15,17], Knee:[16,18], Thigh:[22,24],Bottom:[17,20]},
//   M:  { Length:[36,38], Waist:[30,32], Hip:[38,40], Shoulder:[16,17], Chest:[38,40], Armhole:[16,18], 'Sleeve Length':[22,24], Wrist:[7,9], 'Bottom/Damman':[16,18], Knee:[17,19], Thigh:[23,26],Bottom:[21,22]},
//   L:  { Length:[39,41], Waist:[33,35], Hip:[41,43], Shoulder:[17,18], Chest:[41,43], Armhole:[17,19], 'Sleeve Length':[23,25], Wrist:[8,10], 'Bottom/Damman':[17,19], Knee:[18,20], Thigh:[25,28],Bottom:[23,24]},
// };

// const shirtFields   = ['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman'];
// const trouserFields = ['Length','Waist','Knee','Thigh','Hip','Bottom'];

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState("");
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [measurements, setMeasurements] = useState({});
//   const [errors, setErrors] = useState({});
//   const [showCustom, setShowCustom] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [showHowTo, setShowHowTo] = useState(true);
//   const [howImage, setHowImage] = useState('/assets/how1.webp');
  
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/products/${id}`);
//         setProduct(res.data);
//         if (res.data.images && res.data.images.length > 0) setSelectedImage(res.data.images[0]);
//       } catch (err) {
//         console.error("Error fetching product:", err.message);
//         setError("Failed to fetch product data. Please try again.");
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleMeasurementChange = (field, value, min, max) => {
//     const num = Number(value);
//     setMeasurements(prev => ({ ...prev, [field]: value }));

//     setErrors(prev => {
//       const newErrors = { ...prev };
//       if (!value || value === '') {
//         newErrors[field] = `${field} is required`;
//       } else if (!showCustom && min !== undefined && max !== undefined && (num < min || num > max)) {
//         newErrors[field] = `${field} must be between ${min}-${max}`;
//       } else {
//         delete newErrors[field];
//       }
//       return newErrors;
//     });
//   };

//   const renderTableInputs = fields =>
//     fields.map(field => {
//       const range = (selectedSize && !showCustom) ? sizeRanges[selectedSize][field] : null;
//       return (
//         <div className="measurement-group" key={field}>
//           <label>{field}</label>
//           <input
//             type="number"
//             name={field}
//             placeholder={range ? `${range[0]} - ${range[1]}` : ''}
//             value={measurements[field] || ''}
//             onChange={e => handleMeasurementChange(field, e.target.value, range?.[0], range?.[1])}
//             className={errors[field] ? 'error' : ''}
//           />
//           {errors[field] && <small className="error-text">{errors[field]}</small>}
//         </div>
//       );
//     });

//   const handleAddToCart = () => {
//     const allRequired = [...shirtFields, ...trouserFields];

//     // Check for missing or invalid
//     if (Object.keys(errors).length > 0) {
//       alert("Please fix errors before adding to cart");
//       return;
//     }

//     for (let f of allRequired) {
//       if (!measurements[f] || measurements[f] === '') {
//         setErrors(prev => ({ ...prev, [f]: `${f} is required` }));
//         return;
//       }
//     }

//     if (!localStorage.getItem('user')) {
//       alert('Please login first!');
//       return;
//     }

//     dispatch(addToCart({
//       id: Date.now(),
//       name: product.name,
//       price: product.new_price,
//       image: selectedImage,
//       size: selectedSize,
//       measurements,
//       quantity
//     }));

//     alert('Item added to cart!');
//   };

//   if (error) return <p>{error}</p>;
//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-detail-page">
//       <button onClick={() => window.history.back()} className="back-button">← Back</button>

//       <div className="main-layout">
//         {/* Left - Thumbnails */}
//         {/* <div className="thumbnails-section">
//           <div className="thumbnail-column">
//             {product.images.map((img, idx) => (
//               <img 
//                 key={idx} 
//                 src={img} 
//                 alt={product.name}
//                 className={img === selectedImage ? 'active' : ''}
//                 onClick={() => setSelectedImage(img)} 
//               />
//             ))}
//           </div>
//         </div> */}
//         <div className="thumbnails-section">
//   <div className="thumbnail-column">
//     {product.images.map((img, idx) => (
//       <img 
//         key={idx} 
//         src={img} 
//         alt={product.name}
//         className={img === selectedImage ? 'active' : ''}
//         onClick={() => setSelectedImage(img)} 
//       />
//     ))}
//   </div>
// </div>


//         {/* Center - Main Image */}
//         <div className="image-section">
//           <div className="main-image-container">
//             <img className="main-image" src={selectedImage} alt={product.name} />
//           </div>
//         </div>

//         {/* Right - Product Info */}
//         <div className="info-section">
//           <div className="product-info-container">
//             <div className="product-header">
//               <h2>{product.name}</h2>
//               <p className="price">
//                 {product.old_price && <span className="old-price">Rs {product.old_price}</span>}
//                 <span className="new-price">Rs {product.new_price}</span>
//               </p>
//             </div>

//             <div className="size-section">
//               <h3>Select Size:</h3>
//               <div className="size-buttons">
//                 {Object.keys(sizeRanges).map(size => (
//                   <button key={size}
//                     className={selectedSize === size ? 'selected' : ''}
//                     onClick={() => { 
//                       setSelectedSize(size); 
//                       setShowCustom(false); 
//                       setMeasurements({}); 
//                       setErrors({});
//                     }}>
//                     {size}
//                   </button>
//                 ))}
//                 <button className={showCustom ? 'selected' : ''}
//                   onClick={() => { 
//                     setShowCustom(true); 
//                     setSelectedSize(''); 
//                     setMeasurements({}); 
//                     setErrors({});
//                   }}>
//                   Custom
//                 </button>
//               </div>
//             </div>
//           </div>

//           {(selectedSize || showCustom) && (
//             <div className="measurements-main-container">
//               <div className="measure-table-container">
//                 <div className="measure-table">
//                   <h3>{showCustom ? 'Customize Your Measurements' : 'Standard Measurements'}</h3>
//                   <div className="shirt-section">
//                     <h4 className="table-heading">Shirt Measurements</h4>
//                     <div className="fields-grid">{renderTableInputs(shirtFields)}</div>
//                   </div>
//                   <div className="trouser-section">
//                     <h4 className="table-heading">Trouser Measurements</h4>
//                     <div className="fields-grid">{renderTableInputs(trouserFields)}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="how-to-container">
//                 <div className="how-to-measure">
//                   <h3 onClick={() => setShowHowTo(!showHowTo)}>
//                     How to Measure {showHowTo ? '-' : '+'}
//                   </h3>
//                   {showHowTo && (
//                     <div className="how-images">
//                       <button className="how-arrow"
//                         onClick={() => setHowImage(prev => prev === '/assets/how1.webp' ? '/assets/how2.webp' : '/assets/how1.webp')}>⟷</button>
//                       <img src={howImage} alt="How to Measure" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="cart-section">
//             <label>Quantity:</label>
//             <input 
//               type="number" 
//               min={1} 
//               value={quantity} 
//               onChange={e => setQuantity(Number(e.target.value))} 
//             />
//             <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
//           </div>
//         </div>
//            {product.description && product.description.length > 0 && (
//   <div className="product-description">
//     <h3>Product Description</h3>
//     {product.description.map((line, index) => (
//       <p key={index}>{line}</p>
//     ))}
//   </div>
// )}
        
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import "./ProductDetailPage.css";

const sizeRanges = {
  XS: { Length: [30,32], Waist:[24,26], Hip:[34,36], Shoulder:[14,15], Chest:[32,34], Armhole:[14,16], 'Sleeve Length':[20,22], Wrist:[7,9], 'Bottom/Damman':[14,16], Knee:[15,17], Thigh:[20,22],Bottom:[14,16]},
  S:  { Length:[33,35], Waist:[27,29], Hip:[35,37], Shoulder:[15,16], Chest:[35,37], Armhole:[15,17], 'Sleeve Length':[21,23], Wrist:[7,9], 'Bottom/Damman':[15,17], Knee:[16,18], Thigh:[22,24],Bottom:[17,20]},
  M:  { Length:[36,38], Waist:[30,32], Hip:[38,40], Shoulder:[16,17], Chest:[38,40], Armhole:[16,18], 'Sleeve Length':[22,24], Wrist:[7,9], 'Bottom/Damman':[16,18], Knee:[17,19], Thigh:[23,26],Bottom:[21,22]},
  L:  { Length:[39,41], Waist:[33,35], Hip:[41,43], Shoulder:[17,18], Chest:[41,43], Armhole:[17,19], 'Sleeve Length':[23,25], Wrist:[8,10], 'Bottom/Damman':[17,19], Knee:[18,20], Thigh:[25,28],Bottom:[23,24]},
};

const shirtFields   = ['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman'];
const trouserFields = ['Length','Waist','Knee','Thigh','Hip','Bottom'];

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userInfo);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [measurements, setMeasurements] = useState({});
  const [errors, setErrors] = useState({});
  const [showCustom, setShowCustom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showHowTo, setShowHowTo] = useState(true);
  const [howImage, setHowImage] = useState('/assets/how1.webp');
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) setSelectedImage(res.data.images[0]);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError("Failed to fetch product data. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  // Fill suggested measurements if user is logged in
  useEffect(() => {
    if (user && user.measurements) {
      setMeasurements(user.measurements);
    }
  }, [user]);

  const handleMeasurementChange = (field, value, min, max) => {
    const num = Number(value);
    setMeasurements(prev => ({ ...prev, [field]: value }));

    setErrors(prev => {
      const newErrors = { ...prev };
      if (!value || value === '') {
        newErrors[field] = `${field} is required`;
      } else if (!showCustom && min !== undefined && max !== undefined && (num < min || num > max)) {
        newErrors[field] = `${field} must be between ${min}-${max}`;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const renderTableInputs = fields =>
    fields.map(field => {
      const range = (selectedSize && !showCustom) ? sizeRanges[selectedSize][field] : null;
      return (
        <div className="measurement-group" key={field}>
          <label>{field}</label>
          <input
            type="number"
            name={field}
            placeholder={range ? `${range[0]} - ${range[1]}` : ''}
            value={measurements[field] || ''}
            onChange={e => handleMeasurementChange(field, e.target.value, range?.[0], range?.[1])}
            className={errors[field] ? 'error' : ''}
          />
          {errors[field] && <small className="error-text">{errors[field]}</small>}
        </div>
      );
    });

  const handleAddToCart = () => {
    const allRequired = [...shirtFields, ...trouserFields];

    if (Object.keys(errors).length > 0) {
      alert("Please fix errors before adding to cart");
      return;
    }

    for (let f of allRequired) {
      if (!measurements[f] || measurements[f] === '') {
        setErrors(prev => ({ ...prev, [f]: `${f} is required` }));
        return;
      }
    }

    dispatch(addToCart({
      id: Date.now(),
       productId: product._id,
      name: product.name,
      price: product.new_price,
      image: selectedImage,
      size: selectedSize,
      measurements,
      quantity
    }));

    alert('Item added to cart!');
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
      <button onClick={() => window.history.back()} className="back-button">← Back</button>

      <div className="main-layout">
        <div className="thumbnails-section">
          <div className="thumbnail-column">
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={product.name}
                className={img === selectedImage ? 'active' : ''}
                onClick={() => setSelectedImage(img)} 
              />
            ))}
          </div>
        </div>

        <div className="image-section">
          <div className="main-image-container">
            <img className="main-image" src={selectedImage} alt={product.name} />
          </div>
        </div>

        <div className="info-section">
          <div className="product-info-container">
            <div className="product-header">
              <h2>{product.name}</h2>
              <p className="price">
                {product.old_price && <span className="old-price">Rs {product.old_price}</span>}
                <span className="new-price">Rs {product.new_price}</span>
              </p>
            </div>

            <div className="size-section">
              <h3>Select Size:</h3>
              <div className="size-buttons">
                {Object.keys(sizeRanges).map(size => (
                  <button key={size}
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => { 
                      setSelectedSize(size); 
                      setShowCustom(false); 
                      setMeasurements(user?.measurements || {}); 
                      setErrors({}); 
                    }}>
                    {size}
                  </button>
                ))}
                <button className={showCustom ? 'selected' : ''}
                  onClick={() => { 
                    setShowCustom(true); 
                    setSelectedSize(''); 
                    setMeasurements(user?.measurements || {}); 
                    setErrors({}); 
                  }}>
                  Custom
                </button>
              </div>
            </div>
          </div>

          {(selectedSize || showCustom) && (
            <div className="measurements-main-container">
              <div className="measure-table-container">
                <div className="measure-table">
                  <h3>{showCustom ? 'Customize Your Measurements' : 'Standard Measurements'}</h3>
                  <div className="shirt-section">
                    <h4 className="table-heading">Shirt Measurements</h4>
                    <div className="fields-grid">{renderTableInputs(shirtFields)}</div>
                  </div>
                  <div className="trouser-section">
                    <h4 className="table-heading">Trouser Measurements</h4>
                    <div className="fields-grid">{renderTableInputs(trouserFields)}</div>
                  </div>
                </div>
              </div>

              <div className="how-to-container">
                <div className="how-to-measure">
                  <h3 onClick={() => setShowHowTo(!showHowTo)}>
                    How to Measure {showHowTo ? '-' : '+'}
                  </h3>
                  {showHowTo && (
                    <div className="how-images">
                      <button className="how-arrow"
                        onClick={() => setHowImage(prev => prev === '/assets/how1.webp' ? '/assets/how2.webp' : '/assets/how1.webp')}>⟷</button>
                      <img src={howImage} alt="How to Measure" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="cart-section">
            <label>Quantity:</label>
            <input 
              type="number" 
              min={1} 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))} 
            />
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>

        {product.description && product.description.length > 0 && (
          <div className="product-description">
            <h3>Product Description</h3>
            {product.description.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
