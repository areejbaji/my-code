
// import React, { useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import './ProductDetailPage.css';
// import { useDispatch } from 'react-redux';
// import { addToCart } from './redux/cartSlice';
// import data from './data/mensProducts.json';

// const sizeRanges = {
//   XS: { Length: [30,32], Waist:[24,26], Hip:[34,36], Shoulder:[14,15], Chest:[32,34], Armhole:[14,16], 'Sleeve Length':[20,22], Wrist:[7,9], 'Bottom/Damman':[14,16], Knee:[15,17], Thigh:[20,22]},
//   S:  { Length:[33,35], Waist:[27,29], Hip:[35,37], Shoulder:[15,16], Chest:[35,37], Armhole:[15,17], 'Sleeve Length':[21,23], Wrist:[7,9], 'Bottom/Damman':[15,17], Knee:[16,18], Thigh:[22,24]},
//   M:  { Length:[36,38], Waist:[30,32], Hip:[38,40], Shoulder:[16,17], Chest:[38,40], Armhole:[16,18], 'Sleeve Length':[22,24], Wrist:[7,9], 'Bottom/Damman':[16,18], Knee:[17,19], Thigh:[23,26]},
//   L:  { Length:[39,41], Waist:[33,35], Hip:[41,43], Shoulder:[17,18], Chest:[41,43], Armhole:[17,19], 'Sleeve Length':[23,25], Wrist:[8,10], 'Bottom/Damman':[17,19], Knee:[18,20], Thigh:[25,28]},
// };

// const shirtFields   = ['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman'];
// const trouserFields = ['Length','Waist','Knee','Thigh','Hip','Bottom'];

// const ProductDetailPage = () => {
//   const { state } = useLocation();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   let product = state || data.suits.find(x=>String(x.id)===id) || data.kurtas.find(x=>String(x.id)===id);
//   if(!product) return <p>Product not found</p>

//   const { name,price,oldPrice,description,images,note } = product;

//   const [selectedImage,setSelectedImage] = useState(images[0]);
//   const [selectedSize,setSelectedSize]   = useState('');
//   const [measurements,setMeasurements]   = useState({});
//   const [showCustom,setShowCustom]       = useState(false);

//   const [showHowTo,setShowHowTo] = useState(true);
//   const [howImage,setHowImage]   = useState('/assets/how1.webp');
//   const howArray = ['/assets/how1.webp','/assets/how2.webp'];

//   const [quantity,setQuantity] = useState(1);

//   const handleMeasurementChange = (field,value,min,max)=>{
//     const num = Number(value);

//     // let user type freely (value is still stored)
//     setMeasurements(prev=>({...prev,[field]:value}));

//     // validate after typing -> done in onBlur below
//   }

//   const validateMeasurement = (field,value,min,max)=>{
//     const num = Number(value);
//     if(showCustom){
//       if(num<=0) { alert("Value must be greater than 0"); return false; }
//     }else{
//       if (num < min){ alert(`Value must not be less than ${min}`); return false;}
//       if (num > max){ alert(`Value must not be greater than ${max}`); return false;}
//     }
//     return true;
//   }

//   const renderTableInputs = fields => (
//     fields.map(field=>{
//       const range = (selectedSize && !showCustom)? sizeRanges[selectedSize][field] : null;
//       return(
//         <div className="measurement-group" key={field}>
//           <label>{field}</label>
//           <input
//             type="number"
//             placeholder={range?`${range[0]} - ${range[1]}`:''}
//             value={measurements[field] || ''}
//             onChange={e => handleMeasurementChange(field,e.target.value,range?.[0],range?.[1])}
//             onBlur={e => {
//               if(range){
//                 validateMeasurement(field,e.target.value, range[0],range[1]);
//               }else{
//                 validateMeasurement(field, e.target.value);
//               }
//             }}
//           />
//         </div>
//       )
//     })
//   );

//   const handleAddToCart = ()=>{
//     // check empty fields
//     const allRequired = [...shirtFields,...trouserFields];
//     for(let f of allRequired){
//       if(!measurements[f] || measurements[f]===''){
//         alert('Please fill all measurement fields');
//         return;
//       }
//     }
//     if(!localStorage.getItem('user')) return alert('Please login first!');
//     dispatch(addToCart({id:Date.now(),name,price,image:selectedImage,size:selectedSize,measurements,quantity}));
//     alert('Item added to cart!');
//   }

//   return (
//   <div className="product-detail">
//     <button onClick={()=>navigate(-1)} className="back-button">← Back</button>

//     <div className="detail-container">

//       {/* images */}
//       <div className="detail-left">
//         <div className="thumbnail-column">
//           {images.map(img=>(
//             <img key={img} src={img} className={img===selectedImage?'active':''} onClick={()=>setSelectedImage(img)} />
//           ))}
//         </div>
//         <div className="main-image-container">
//           <button className="gallery-arrow left-arrow"  onClick={()=>{
//             const i = images.indexOf(selectedImage);
//             setSelectedImage(images[(i-1+images.length)%images.length]);
//           }}>&#8249;</button>
//           <img className="main-image" src={selectedImage} alt=""/>
//           <button className="gallery-arrow right-arrow" onClick={()=>{
//             const i = images.indexOf(selectedImage);
//             setSelectedImage(images[(i+1)%images.length]);
//           }}>&#8250;</button>
//         </div>
//       </div>

//       {/* product info */}
//       <div className="detail-right">
//         <h2>{name}</h2>
//         <p className="price">
//           {oldPrice && <span className="old-price">₨ {oldPrice}</span>}
//           ₨ {price}
//         </p>
//         <p className="note">
//           <span style={{color:'red'}}>Note:</span> <span style={{fontWeight:600}}>{note}</span>
//         </p>

//         <div className="size-section">
//           <h3>Select Size:</h3>
//           <div className="size-buttons">
//             {Object.keys(sizeRanges).map(size=>(
//               <button key={size}
//                 className={selectedSize===size?'selected':''}
//                 onClick={()=>{ setSelectedSize(size); setShowCustom(false); setMeasurements({}); }}>
//                 {size}
//               </button>
//             ))}
//             <button className={showCustom?'selected':''}
//               onClick={()=>{setShowCustom(true); setSelectedSize(''); setMeasurements({});}}>
//               Custom
//             </button>
//           </div>
//         </div>

//         {(selectedSize || showCustom) && (
//          <div className="measurements-container">
//             <div className="measure-table">
//               <h3>{showCustom?'Customize Your Measurements':'Standard Measurements'}</h3>
//               <h4 className="table-heading">Shirt Measurements</h4>
//               <div className="fields-grid">{renderTableInputs(shirtFields)}</div>
//               <h4 className="table-heading">Trouser Measurements</h4>
//               <div className="fields-grid">{renderTableInputs(trouserFields)}</div>
//             </div>

//             <div className="how-to-measure">
//               <h3 onClick={()=>setShowHowTo(!showHowTo)}>How to Measure {showHowTo ? '-' : '+'}</h3>
//               {showHowTo && (
//                 <div className="how-images">
//                   <button className="how-arrow"
//                     onClick={()=>setHowImage(prev=>prev==='/assets/how1.webp'?'/assets/how2.webp':'/assets/how1.webp')}
//                   >&#8249;</button>
//                   <img src={howImage} className="how-main-image" alt="how" />
//                   <button className="how-arrow"
//                     onClick={()=>setHowImage(prev=>prev==='/assets/how1.webp'?'/assets/how2.webp':'/assets/how1.webp')}
//                   >&#8250;</button>
//                 </div>
//               )}
//             </div>
//          </div>
//         )}

//         <div className="cart-section">
//           <div className="quantity-container">
//             <button onClick={()=>setQuantity(q=>Math.max(1,q-1))}>-</button>
//             <input value={quantity} readOnly />
//             <button onClick={()=>setQuantity(q=>q+1)}>+</button>
//           </div>
//           <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
//         </div>

//         <div className="product-description">
//           <h3>Product Description</h3>
//           {Array.isArray(description)?(
//             <ul>{description.map((d,i)=><li key={d+i}>{d}</li>)}</ul>
//           ):<p>{description}</p>}
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default ProductDetailPage;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const ProductDetailPage = () => {
//   const { id } = useParams(); // Product ID from URL
//   const [product, setProduct] = useState(null);
//   const [sizeChart, setSizeChart] = useState(null);

//   // Fetch product details
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/products/${id}`);
//         setProduct(res.data.product);

//         // If product has sizeChart ID
//         if (res.data.product.sizeChart) {
//           const chartRes = await axios.get(
//             `http://localhost:4000/api/sizecharts/${res.data.product.sizeChart}`
//           );
//           setSizeChart(chartRes.data.chart);
//         }
//       } catch (err) {
//         console.log("Error fetching product:", err);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) return <p>Loading product...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>{product.name}</h1>
//       <p>Category: {product.subCategory}</p>

//       {/* Product Images */}
//       <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
//         {product.images.map((img, idx) => (
//           <img key={idx} src={img} alt={product.name} style={{ width: "150px" }} />
//         ))}
//       </div>

//       <p>Price: PKR {product.new_price}</p>

//       {/* Size Chart */}
//       {sizeChart ? (
//         <div>
//           <h2>Size Chart: {sizeChart.category}</h2>
//           {sizeChart.sizes.map((sizeObj, idx) => (
//             <div key={idx} style={{ marginBottom: "15px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
//               <h3>{sizeObj.size}</h3>

//               {/* Conditional Measurements */}
//               {product.subCategory === "frock" && sizeObj.frock && (
//                 <div>
//                   <strong>Frock Measurements:</strong>
//                   {Object.entries(sizeObj.frock).map(([key, value]) => (
//                     <p key={key}>
//                       {key}: {value.length ? value.join(" - ") : ""}
//                     </p>
//                   ))}
//                 </div>
//               )}

//               {product.subCategory === "kurta" && sizeObj.shirt && (
//                 <div>
//                   <strong>Kurta Measurements:</strong>
//                   {Object.entries(sizeObj.shirt).map(([key, value]) => (
//                     <p key={key}>
//                       {key}: {value.length ? value.join(" - ") : ""}
//                     </p>
//                   ))}
//                 </div>
//               )}

//               {(product.subCategory === "men-suit" || product.subCategory === "women-suit") &&
//                 sizeObj.shirt && (
//                   <div>
//                     <strong>Shirt Measurements:</strong>
//                     {Object.entries(sizeObj.shirt).map(([key, value]) => (
//                       <p key={key}>
//                         {key}: {value.length ? value.join(" - ") : ""}
//                       </p>
//                     ))}
//                   </div>
//                 )}

//               {/* Trouser always */}
//               {sizeObj.trouser && (
//                 <div>
//                   <strong>Trouser Measurements:</strong>
//                   {Object.entries(sizeObj.trouser).map(([key, value]) => (
//                     <p key={key}>
//                       {key}: {value.length ? value.join(" - ") : ""}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No size chart available for this product.</p>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import "./ProductDetailPage.css";

const sizeRanges = {
  XS: { Length: [30,32], Waist:[24,26], Hip:[34,36], Shoulder:[14,15], Chest:[32,34], Armhole:[14,16], 'Sleeve Length':[20,22], Wrist:[7,9], 'Bottom/Damman':[14,16], Knee:[15,17], Thigh:[20,22]},
  S:  { Length:[33,35], Waist:[27,29], Hip:[35,37], Shoulder:[15,16], Chest:[35,37], Armhole:[15,17], 'Sleeve Length':[21,23], Wrist:[7,9], 'Bottom/Damman':[15,17], Knee:[16,18], Thigh:[22,24]},
  M:  { Length:[36,38], Waist:[30,32], Hip:[38,40], Shoulder:[16,17], Chest:[38,40], Armhole:[16,18], 'Sleeve Length':[22,24], Wrist:[7,9], 'Bottom/Damman':[16,18], Knee:[17,19], Thigh:[23,26]},
  L:  { Length:[39,41], Waist:[33,35], Hip:[41,43], Shoulder:[17,18], Chest:[41,43], Armhole:[17,19], 'Sleeve Length':[23,25], Wrist:[8,10], 'Bottom/Damman':[17,19], Knee:[18,20], Thigh:[25,28]},
};

const shirtFields   = ['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman'];
const trouserFields = ['Length','Waist','Knee','Thigh','Hip','Bottom'];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [measurements, setMeasurements] = useState({});
  const [showCustom, setShowCustom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showHowTo, setShowHowTo] = useState(true);
  const [howImage, setHowImage] = useState('/assets/how1.webp');
  const howArray = ['/assets/how1.webp','/assets/how2.webp'];
  
  const dispatch = useDispatch();

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

  const handleMeasurementChange = (field, value, min, max) => {
    const num = Number(value);
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const validateMeasurement = (field, value, min, max) => {
    const num = Number(value);
    if (showCustom) {
      if (num <= 0) { 
        alert("Value must be greater than 0"); 
        return false; 
      }
    } else {
      if (num < min) { 
        alert(`Value must not be less than ${min}`); 
        return false;
      }
      if (num > max) { 
        alert(`Value must not be greater than ${max}`); 
        return false;
      }
    }
    return true;
  };

  const renderTableInputs = fields => (
    fields.map(field => {
      const range = (selectedSize && !showCustom) ? sizeRanges[selectedSize][field] : null;
      return (
        <div className="measurement-group" key={field}>
          <label>{field}</label>
          <input
            type="number"
            placeholder={range ? `${range[0]} - ${range[1]}` : ''}
            value={measurements[field] || ''}
            onChange={e => handleMeasurementChange(field, e.target.value, range?.[0], range?.[1])}
            onBlur={e => {
              if (range) {
                validateMeasurement(field, e.target.value, range[0], range[1]);
              } else {
                validateMeasurement(field, e.target.value);
              }
            }}
          />
        </div>
      );
    })
  );

  const handleAddToCart = () => {
    const allRequired = [...shirtFields, ...trouserFields];
    for (let f of allRequired) {
      if (!measurements[f] || measurements[f] === '') {
        alert('Please fill all measurement fields');
        return;
      }
    }
    if (!localStorage.getItem('user')) return alert('Please login first!');
    
    dispatch(addToCart({
      id: Date.now(),
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
        
        {/* Left - Thumbnails */}
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

        {/* Center - Main Image */}
        <div className="image-section">
          <div className="main-image-container">
            <img className="main-image" src={selectedImage} alt={product.name} />
          </div>
        </div>

        {/* Right - Product Info Container */}
        <div className="info-section">
          <div className="product-info-container">
            
            {/* Product Name and Price */}
            <div className="product-header">
              <h2>{product.name}</h2>
              <p className="price">
                {product.old_price && <span className="old-price">₨ {product.old_price}</span>}
                <span className="new-price">₨ {product.new_price}</span>
              </p>
            </div>

            {/* Size Selection */}
            <div className="size-section">
              <h3>Select Size:</h3>
              <div className="size-buttons">
                {Object.keys(sizeRanges).map(size => (
                  <button key={size}
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => { 
                      setSelectedSize(size); 
                      setShowCustom(false); 
                      setMeasurements({}); 
                    }}>
                    {size}
                  </button>
                ))}
                <button className={showCustom ? 'selected' : ''}
                  onClick={() => { 
                    setShowCustom(true); 
                    setSelectedSize(''); 
                    setMeasurements({}); 
                  }}>
                  Custom
                </button>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="cart-section">
              <div className="quantity-container">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <input value={quantity} readOnly />
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

          </div>

          {/* Measurements and How to Measure Container */}
          {(selectedSize || showCustom) && (
            <div className="measurements-main-container">
              
              {/* Left - Measurements Table */}
              <div className="measure-table-container">
                <div className="measure-table">
                  <h3>{showCustom ? 'Customize Your Measurements' : 'Standard Measurements'}</h3>
                  
                  <div className="shirt-section">
                    <h4 className="table-heading">Shirt Measurements</h4>
                    <div className="fields-grid">
                      {renderTableInputs(shirtFields)}
                    </div>
                  </div>

                  <div className="trouser-section">
                    <h4 className="table-heading">Trouser Measurements</h4>
                    <div className="fields-grid">
                      {renderTableInputs(trouserFields)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - How to Measure */}
              <div className="how-to-container">
                <div className="how-to-measure">
                  <h3 onClick={() => setShowHowTo(!showHowTo)}>
                    How to Measure {showHowTo ? '-' : '+'}
                  </h3>
                  {showHowTo && (
                    <div className="how-images">
                      <button className="how-arrow"
                        onClick={() => setHowImage(prev => 
                          prev === '/assets/how1.webp' ? '/assets/how2.webp' : '/assets/how1.webp'
                        )}>
                        &#8249;
                      </button>
                      <img 
                        src={howImage} 
                        className="how-main-image" 
                        alt="how to measure"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x400?text=Measurement+Guide';
                        }}
                      />
                      <button className="how-arrow"
                        onClick={() => setHowImage(prev => 
                          prev === '/assets/how1.webp' ? '/assets/how2.webp' : '/assets/how1.webp'
                        )}>
                        &#8250;
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Bottom Center - Product Description */}
      <div className="description-section">
        <div className="product-description">
          <h3>Product Description</h3>
          {Array.isArray(product.description) ? (
            <ul>{product.description.map((d, i) => <li key={i}>{d}</li>)}</ul>
          ) : <p>{product.description}</p>}
        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;



