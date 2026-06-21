import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import { Heart, GitCompare, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, compareList, toggleCompare, addToCart } = useApp();
  const { formatPrice } = useCurrency();

  const isWishlisted = wishlist.some(item => item._id === product._id);
  const isCompared = compareList.some(item => item._id === product._id);

  // Determine card badge tag
  let badgeText = '';
  if (product.isBestSeller) {
    badgeText = 'Best Seller';
  } else if (product.isNewArrival) {
    badgeText = 'New Arrival';
  } else if (product.featured) {
    badgeText = 'Royal Choice';
  }

  // Generate stars array
  const renderStars = (rating) => {
    const stars = [];
    const count = Math.round(rating || 5);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= count ? '#D4AF37' : '#E2E8F0', fontSize: '14px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="product-card">
      {/* Dynamic Ribbon */}
      {badgeText && <div className="product-card-badge">{badgeText}</div>}

      {/* Hover Floating Actions */}
      <div className="product-card-actions">
        <button 
          className={`action-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={() => toggleWishlist(product)}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <button 
          className={`action-btn ${isCompared ? 'active' : ''}`} 
          onClick={() => toggleCompare(product)}
          title={isCompared ? "Remove from Comparison" : "Add to Compare"}
        >
          <GitCompare size={16} />
        </button>
        <Link to={`/product/${product._id}`} className="action-btn" title="Quick View">
          <Eye size={16} />
        </Link>
      </div>

      {/* Product Image Cover */}
      <div className="product-image-container">
        <Link to={`/product/${product._id}`} style={{ width: '100%', height: '100%' }}>
          <img 
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800'} 
            alt={product.name} 
            className="product-image"
          />
        </Link>
      </div>

      {/* Info Details */}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        {/* Rating Row */}
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span style={{ fontSize: '11px', color: '#767676' }}>({product.reviewsCount || 0})</span>
        </div>

        {/* Pricing Row */}
        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button 
            className="product-add-btn" 
            onClick={() => addToCart(product, 1)}
            style={{ border: 'none', background: 'none' }}
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
