// import React from "react";
// import catagoryData from "./data/catagoryData.json";
// import "./Catagory.css";

// export default function Catagory() {
//   return (
//     <div>
//       {/* Heading */}
//       <h2 className="category-heading">Shop By Categories</h2>

//       {/* Categories container */}
//       <div className="categories-container">
//         {catagoryData.map(({ id, img, heading }) => (
//           <div key={id} className="category-card">
//             <img src={img} alt="Category" />
//             <h3>{heading}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import catagoryData from "./data/catagoryData.json";
import "./Catagory.css";

export default function Catagory() {
  return (
    <div>
      {/* Heading */}
      <h2 className="category-heading">Shop By Categories</h2>

      {/* Categories container */}
      <div className="categories-container">
        {catagoryData.map(({ id, img, heading, link }) => (
          <Link to={link} key={id} className="category-card">
            <img src={img} alt={heading} />
            <h3>{heading}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
