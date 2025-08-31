// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./StockManagement.css";

// const StockManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await axios.get('http://localhost:4000/api/admin/products/stock', {
//   headers: { Authorization: `Bearer ${token}` }
//        });
//       setProducts(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setLoading(false);
//     }
//   };

//   const updateStock = async (productId, size, newQuantity, type = 'size') => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       await axios.put(`http://localhost:4000/api/admin/products/${productId}/stock`, {
//         size,
//         quantity: newQuantity,
//         type
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Update local state
//       setProducts(prev => prev.map(product => {
//         if (product._id === productId) {
//           if (type === 'custom') {
//             return { ...product, customStock: newQuantity };
//           } else {
//             return {
//               ...product,
//               stock: { ...product.stock, [size]: newQuantity }
//             };
//           }
//         }
//         return product;
//       }));
//     } catch (error) {
//       console.error('Error updating stock:', error);
//       alert('Failed to update stock');
//     }
//   };

//   const getStockStatus = (stock, customStock) => {
//     const totalSizes = Object.values(stock).reduce((a, b) => a + b, 0);
//     const total = totalSizes + customStock;
    
//     if (total === 0) return { status: 'Out of Stock', class: 'status-out' };
//     if (total <= 5) return { status: 'Low Stock', class: 'status-low' };
//     return { status: 'In Stock', class: 'status-good' };
//   };

//   const getTotalStock = (product) => {
//     const sizeStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
//     return sizeStock + product.customStock;
//   };

//   if (loading) return <div className="loading">Loading products...</div>;

//   return (
//     <div className="stock-management">
//       <div className="stock-header">
//         <h2>Stock Management</h2>
//         <button onClick={fetchProducts} className="refresh-btn">
//           🔄 Refresh
//         </button>
//       </div>

//       <div className="stock-summary">
//         <div className="summary-card">
//           <h3>Total Products</h3>
//           <span className="summary-number">{products.length}</span>
//         </div>
//         <div className="summary-card">
//           <h3>Low Stock Items</h3>
//           <span className="summary-number low">
//             {products.filter(p => getTotalStock(p) <= 5).length}
//           </span>
//         </div>
//         <div className="summary-card">
//           <h3>Out of Stock</h3>
//           <span className="summary-number out">
//             {products.filter(p => getTotalStock(p) === 0).length}
//           </span>
//         </div>
//       </div>

//       <div className="stock-table-container">
//         <table className="stock-table">
//           <thead>
//             <tr>
//               <th>Product Info</th>
//               <th>Size Stock (S/M/L/XL/XXL)</th>
//               <th>Custom Stock</th>
//               <th>Total</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => {
//               const stockStatus = getStockStatus(product.stock, product.customStock);
//               const totalStock = getTotalStock(product);
              
//               return (
//                 <tr key={product._id} className="stock-row">
//                   <td className="product-info">
//                     <div className="product-name">{product.name}</div>
//                     <div className="product-details">
//                       {product.category} - {product.subCategory}
//                     </div>
//                     <div className="product-price">Rs {product.new_price}</div>
//                   </td>
                  
//                   <td className="size-stock">
//                     <div className="size-controls">
//                       {Object.entries(product.stock).map(([size, qty]) => (
//                         <div key={size} className="size-item">
//                           <span className="size-label">{size}</span>
//                           <div className="stock-controls">
//                             <button
//                               onClick={() => updateStock(product._id, size, qty - 1)}
//                               className="stock-btn minus"
//                             >
//                               -
//                             </button>
//                             <span className={`stock-qty ${
//                               qty === 0 ? 'qty-zero' : qty <= 3 ? 'qty-low' : 'qty-good'
//                             }`}>
//                               {qty}
//                             </span>
//                             <button
//                               onClick={() => updateStock(product._id, size, qty + 1)}
//                               className="stock-btn plus"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </td>
                  
//                   <td className="custom-stock">
//                     <div className="stock-controls">
//                       <button
//                         onClick={() => updateStock(product._id, 'custom', product.customStock - 1, 'custom')}
//                         className="stock-btn minus"
//                       >
//                         -
//                       </button>
//                       <span className="stock-qty">{product.customStock}</span>
//                       <button
//                         onClick={() => updateStock(product._id, 'custom', product.customStock + 1, 'custom')}
//                         className="stock-btn plus"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </td>
                  
//                   <td className="total-stock">
//                     <span className={`total-number ${
//                       totalStock === 0 ? 'total-zero' : totalStock <= 5 ? 'total-low' : 'total-good'
//                     }`}>
//                       {totalStock}
//                     </span>
//                   </td>
                  
//                   <td className="stock-status">
//                     <span className={`status-badge ${stockStatus.class}`}>
//                       {stockStatus.status}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StockManagement;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockManagement.css";

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:4000/api/admin/products/stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setLoading(false);
      setHasChanges(false);
      setPendingUpdates({});
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      const search = searchTerm.toLowerCase();
      const totalStock = getTotalStock(product);
      const stockStatus = getStockStatus(product.stock, product.customStock).status;
      
      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.subCategory.toLowerCase().includes(search) ||
        totalStock.toString().includes(search) ||
        stockStatus.toLowerCase().includes(search)
      );
    });
    
    setFilteredProducts(filtered);
  };

  const handleStockChange = (productId, size, newQuantity, type = 'size') => {
    setProducts(prev => prev.map(product => {
      if (product._id === productId) {
        if (type === 'custom') {
          return { ...product, customStock: Math.max(0, newQuantity) };
        } else {
          return {
            ...product,
            stock: { ...product.stock, [size]: Math.max(0, newQuantity) }
          };
        }
      }
      return product;
    }));

    setPendingUpdates(prev => ({
      ...prev,
      [`${productId}-${size}-${type}`]: { productId, size, quantity: Math.max(0, newQuantity), type }
    }));

    setHasChanges(true);
  };

  const updateAllChanges = async () => {
    if (!hasChanges || Object.keys(pendingUpdates).length === 0) {
      alert('No changes to update');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const updatePromises = Object.values(pendingUpdates).map(update => 
        axios.put(`http://localhost:4000/api/admin/products/${update.productId}/stock`, {
          size: update.size,
          quantity: update.quantity,
          type: update.type
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(updatePromises);
      
      setPendingUpdates({});
      setHasChanges(false);
      setLoading(false);
      
      alert('Changes updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      setLoading(false);
      alert('Failed to update changes');
    }
  };

  const getStockStatus = (stock, customStock) => {
    const totalSizes = Object.values(stock).reduce((a, b) => a + b, 0);
    const total = totalSizes + customStock;
    
    if (total === 0) return { status: 'Out of Stock', class: 'out-of-stock' };
    if (total <= 5) return { status: 'Low Stock', class: 'low-stock' };
    return { status: 'In Stock', class: 'in-stock' };
  };

  const getTotalStock = (product) => {
    const sizeStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
    return sizeStock + product.customStock;
  };

  const getStockCounts = () => {
    const total = products.length;
    const lowStock = products.filter(p => getTotalStock(p) <= 5 && getTotalStock(p) > 0).length;
    const outOfStock = products.filter(p => getTotalStock(p) === 0).length;
    const inStock = total - lowStock - outOfStock;
    
    return { total, inStock, lowStock, outOfStock };
  };

  const stockCounts = getStockCounts();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="stock-management">
      <div className="header">
        <h2>Stock Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, category, stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={updateAllChanges} 
            className={`update-btn ${hasChanges ? 'active' : ''}`}
            disabled={!hasChanges}
          >
            Save Changes {hasChanges && `(${Object.keys(pendingUpdates).length})`}
          </button>
        </div>
      </div>

      <div className="stats-badges">
        <div className="badge total">
          <span className="count">{stockCounts.total}</span>
          <span className="label">Total Products</span>
        </div>
        <div className="badge in-stock">
          <span className="count">{stockCounts.inStock}</span>
          <span className="label">In Stock</span>
        </div>
        <div className="badge low-stock">
          <span className="count">{stockCounts.lowStock}</span>
          <span className="label">Low Stock</span>
        </div>
        <div className="badge out-of-stock">
          <span className="count">{stockCounts.outOfStock}</span>
          <span className="label">Out of Stock</span>
        </div>
      </div>

      {hasChanges && (
        <div className="changes-alert">
          You have unsaved changes. Click "Save Changes" to update.
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size Stock</th>
              <th>Custom</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.customStock);
              const totalStock = getTotalStock(product);
              
              return (
                <tr key={product._id}>
                  <td className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">
                      {product.category} • {product.subCategory}
                    </div>
                    <div className="product-price">Rs {product.new_price}</div>
                  </td>
                  
                  <td className="size-stock">
                    {Object.entries(product.stock).map(([size, qty]) => (
                      <div key={size} className="size-control">
                        <span className="size">{size}</span>
                        <div className="controls">
                          <button
                            onClick={() => handleStockChange(product._id, size, qty - 1)}
                            disabled={qty <= 0}
                          >
                            -
                          </button>
                          <span className={`qty ${qty === 0 ? 'zero' : qty <= 3 ? 'low' : ''}`}>
                            {qty}
                          </span>
                          <button
                            onClick={() => handleStockChange(product._id, size, qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </td>
                  
                  <td className="custom-stock">
                    <div className="controls">
                      <button
                        onClick={() => handleStockChange(product._id, 'custom', product.customStock - 1, 'custom')}
                        disabled={product.customStock <= 0}
                      >
                        -
                      </button>
                      <span className="qty">{product.customStock}</span>
                      <button
                        onClick={() => handleStockChange(product._id, 'custom', product.customStock + 1, 'custom')}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  
                  <td className="total-stock">
                    <span className={`total ${totalStock === 0 ? 'zero' : totalStock <= 5 ? 'low' : ''}`}>
                      {totalStock}
                    </span>
                  </td>
                  
                  <td className="status">
                    <span className={`status-badge ${stockStatus.class}`}>
                      {stockStatus.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default StockManagement;