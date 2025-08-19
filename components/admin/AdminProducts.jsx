 import React, { useEffect, useState } from 'react';
import apis from '../../utils/apis';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  });

  const token = localStorage.getItem('accessToken');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().adminProducts, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load products');
      setProducts(data.products || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apis().adminProducts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
          status: form.status,
          image: form.image
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create product');
      setForm({ title: '', category: '', price: '', stock: '', status: 'active', image: '' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      const res = await fetch(`${apis().adminProducts}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to delete product');
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Manage Products</h2>

      <form onSubmit={create} style={{ marginBottom: 30, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          min={0}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          min={0}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="url"
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1.5px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            gridColumn: 'span 1',
            padding: '12px 0',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: '700',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Add Product
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price (Rs)</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>
                No products found.
              </td>
            </tr>
          )}
          {products.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                  '—'
                )}
              </td>
              <td style={tdStyle}>{p.title}</td>
              <td style={tdStyle}>{p.category}</td>
              <td style={tdStyle}>{p.price}</td>
              <td style={tdStyle}>{p.stock}</td>
              <td style={{ ...tdStyle, color: p.status === 'active' ? 'green' : 'red', fontWeight: '700' }}>{p.status}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => remove(p._id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 15px',
  borderBottom: '2px solid #ddd',
  fontWeight: '600',
  color: '#475569',
};

const tdStyle = {
  padding: '12px 15px',
  verticalAlign: 'middle',
};
