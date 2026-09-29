import { fetchProducts, fetchCategories } from '../../lib/api';

export default async function ProductsPage() {
  const products = await fetchProducts();
  const categories = await fetchCategories();

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.2rem' }}>Product Catalog</h1>
          <p style={{ color: '#94a3b8' }}>Browse tech hardware, cloud services & DevOps software.</p>
        </div>
        <a href="/cart" className="btn">View Cart 🛒</a>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <span style={{ background: '#38bdf8', color: '#0f172a', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}>All Categories</span>
        {categories.map((cat) => (
          <span key={cat.id} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            {cat.name}
          </span>
        ))}
      </div>

      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="card-footer">
              <span className="price">${product.price.toFixed(2)}</span>
              <a href="/cart" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Add to Cart</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
