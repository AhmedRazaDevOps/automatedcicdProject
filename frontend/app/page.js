import { fetchProducts, fetchHealth } from '../lib/api';

export default async function HomePage() {
  const products = await fetchProducts();
  const health = await fetchHealth();

  return (
    <div>
      <section className="hero">
        <h1>Next.js Ahmed Devops Web Application</h1>
        <p>
          Connected seamlessly to the .NET REST API backend and MySQL database.
          Fast, SSR-enabled user frontend.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="/products" className="btn">Browse Product Catalog</a>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="btn" style={{ background: '#818cf8', color: '#fff' }}>Open Vue Admin Panel</a>
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Featured Products</h2>
        <div className="grid">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="card-footer">
                <span className="price">${product.price.toFixed(2)}</span>
                <span className="status-badge">In Stock ({product.stockQuantity})</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '3rem', background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Backend Health Status</h3>
        <p><strong>Service:</strong> {health.service || '.NET API'}</p>
        <p><strong>Status:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{health.status || 'Active'}</span></p>
        <p><strong>API Endpoint:</strong> <code>http://localhost:5000/api</code></p>
      </section>
    </div>
  );
}
