import Image from 'next/image';

export default function ProductCard({ product }) {
  // Extract numeric ID from variant GID (e.g., "gid://shopify/ProductVariant/123456789" -> "123456789")
  const variantNumericId = product.variantId?.match(/\d+$/)?.[0] || '';
  const checkoutUrl = variantNumericId 
    ? `https://ann-paints-zqbytwuk.myshopify.com/cart/${variantNumericId}:1`
    : '#';

  return (
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
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '1rem',
            background: '#2c6e2f',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            display: 'inline-block',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}