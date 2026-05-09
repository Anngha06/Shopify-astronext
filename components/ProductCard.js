import { useState } from 'react';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Extract numeric variant ID for checkout
  const variantNumericId = product.variantId?.match(/\d+$/)?.[0] || '';
  const checkoutUrl = variantNumericId 
    ? `https://ann-paints-zqbytwuk.myshopify.com/cart/${variantNumericId}:1`
    : '#';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle modal background click to close
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <>
      <div className="product-card">
        {product.image ? (
          <div className="product-image">
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={260}
              style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              unoptimized
            />
          </div>
        ) : (
          <div className="product-image" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>No image</span>
          </div>
        )}
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-price">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.price.currency,
            }).format(product.price.amount)}
          </div>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          <button
            onClick={openModal}
            style={{
              marginTop: '1rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            Know More
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleBackgroundClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              {product.image && (
                <div className="modal-image">
                  <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '0.5rem' }} />
                </div>
              )}
              <h2 className="modal-title">{product.title}</h2>
              <div className="modal-price">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: product.price.currency,
                }).format(product.price.amount)}
              </div>
              <p className="modal-description">{product.description || 'No description available.'}</p>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-buy-button"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}