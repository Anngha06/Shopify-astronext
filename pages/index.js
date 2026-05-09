import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero section with your video */}
      <div className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Ann Paints Portfolio</h1>
          <p>Discover our curated collection of artistic products</p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Products</h2>
        {loading && <div className="loading">Loading products...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer section with your image.jpeg */}
      <div className="footer-image">
        <img src="/image.jpeg" alt="Portfolio decoration" />
      </div>
    </>
  );
}