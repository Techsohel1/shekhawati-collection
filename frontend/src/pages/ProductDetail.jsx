import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import { Heart, GitCompare, ShoppingBag, Truck, Undo2, Award, ShieldAlert, Star, Play, MessageSquarePlus } from 'lucide-react';
import { API_URL } from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, showAlert } = useApp();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [galleryImages, setGalleryImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Zoom Ref and State
  const imageRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' });

  // Generate 8-10 HD images depending on category
  const generateProductImages = (mainImg, category) => {
    const images = [mainImg];
    
    const assets = {
      "Wooden Items": [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800",
        "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
        "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800",
        "https://images.unsplash.com/photo-1595428774754-07321f985390?q=80&w=800"
      ],
      "Artificial Jewellery": [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800",
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800"
      ],
      "Herbal Products": [
        "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800",
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800",
        "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800",
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800",
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800",
        "https://images.unsplash.com/photo-1608571424278-f327a3c3c126?q=80&w=800"
      ],
      "Ladies Suits": [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
        "https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=800",
        "https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=800",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800",
        "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=800",
        "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=800",
        "https://images.unsplash.com/photo-1589810635657-23293df244aa?q=80&w=800"
      ]
    };

    const categoryPool = assets[category] || assets["Wooden Items"];
    // Add unique pool images until we have 9 images
    categoryPool.forEach(img => {
      if (img !== mainImg && images.length < 9) {
        images.push(img);
      }
    });

    return images;
  };

  // Magnifying Zoom coordinates tracking handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center' });
  };

  // Fetch product data and manage recently viewed
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found.');
        
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.images[0]);
        
        // Generate the 9 HD images
        const fullGallery = generateProductImages(data.images[0], data.category);
        setGalleryImages(fullGallery);

        // Track Recently Viewed Items
        logRecentlyViewed(data);

        // Fetch related products
        const relRes = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(data.category)}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          // Filter current product out
          setRelatedProducts(relData.filter(p => p._id !== data._id).slice(0, 4));
        }

      } catch (err) {
        console.error('Error fetching details:', err);
        showAlert('Could not load product details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Load Recently Viewed list from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sc_recently_viewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, [id]);

  const logRecentlyViewed = (currentProd) => {
    let list = [];
    const saved = localStorage.getItem('sc_recently_viewed');
    if (saved) {
      list = JSON.parse(saved);
    }
    // Remove if already exists and add to front
    list = list.filter(item => item._id !== currentProd._id);
    list.unshift({
      _id: currentProd._id,
      name: currentProd.name,
      price: currentProd.price,
      images: currentProd.images,
      category: currentProd.category,
      rating: currentProd.rating
    });
    // Keep max 4
    list = list.slice(0, 4);
    localStorage.setItem('sc_recently_viewed', JSON.stringify(list));
    setRecentlyViewed(list);
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showAlert('Please enter your name and comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewName
        })
      });

      const data = await res.json();
      if (res.ok) {
        showAlert('Thank you! Review posted successfully.', 'success');
        // Add new review to current list dynamically
        setProduct(prev => ({
          ...prev,
          reviews: [data, ...(prev.reviews || [])],
          reviewsCount: (prev.reviewsCount || 0) + 1
        }));
        setReviewName('');
        setReviewComment('');
      } else {
        showAlert(data.message || 'Error posting review. Note: You must be logged in.', 'error');
      }
    } catch (err) {
      showAlert('Could not upload review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const isWishlisted = product && wishlist.some(item => item._id === product._id);
  const isCompared = product && compareList.some(item => item._id === product._id);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E5D5B3',
          borderTopColor: '#6B1D2F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '15px', color: '#767676' }}>Unveiling heritage details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '15px 0', color: '#767676' }}>The product you are trying to view is invalid or has been archived.</p>
        <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      {/* Breadcrumbs */}
      <div style={{ fontSize: '13px', color: '#767676', marginBottom: '30px' }}>
        <Link to="/">Home</Link> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> / <span style={{ color: '#1C1C1C', fontWeight: 500 }}>{product.name}</span>
      </div>

      <div className="details-layout">
        
        {/* Left Side: Images Gallery */}
        <div className="details-gallery">
          {/* Main Zoom Window */}
          <div className="details-main-img-container">
            <img 
              ref={imageRef}
              src={activeImage} 
              alt={product.name} 
              className="details-main-img"
              style={zoomStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          {/* Thumbnails (8-10 images) */}
          <div className="details-thumbnails">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`details-thumb ${img === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`Preview ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Buy Details */}
        <div className="details-info">
          <span style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            {product.category}
          </span>
          <h1>{product.name}</h1>

          {/* Ratings Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ color: '#D4AF37', display: 'flex', gap: '2px' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} style={{ fontSize: '18px', color: idx < Math.round(product.rating || 5) ? '#D4AF37' : '#E2E8F0' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '14px', color: '#767676', fontWeight: 500 }}>
              {product.rating || '5.0'} / 5.0 ({product.reviewsCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="details-price">{formatPrice(product.price)}</div>

          {/* Stock Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px', fontSize: '14px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444'
            }}></div>
            <span style={{ color: product.stock > 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {product.stock > 0 ? `In Stock (Only ${product.stock} left — Shipped from India)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description Snippet */}
          <p className="details-desc">{product.description}</p>

          {/* Quantity Selector & Action buttons */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid #F0EDE4', paddingBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', backgroundColor: '#FFF' }}>
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{ background: 'none', border: 'none', width: '40px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContext: 'center', paddingLeft: '14px' }}
              >
                -
              </button>
              <span style={{ padding: '0 15px', fontSize: '15px', fontWeight: 600 }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                style={{ background: 'none', border: 'none', width: '40px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContext: 'center', paddingLeft: '14px' }}
              >
                +
              </button>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              style={{ flexGrow: 1, height: '47px', opacity: product.stock <= 0 ? 0.6 : 1 }}
            >
              Add To Cart
            </button>
            
            <button 
              className="btn btn-gold"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              style={{ flexGrow: 1, height: '47px', opacity: product.stock <= 0 ? 0.6 : 1 }}
            >
              Buy Now
            </button>
          </div>

          {/* Social comparison buttons */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#1C1C1C', marginBottom: '40px' }}>
            <button 
              onClick={() => toggleWishlist(product)}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Heart size={16} fill={isWishlisted ? '#6B1D2F' : 'none'} style={{ color: isWishlisted ? '#6B1D2F' : '#1C1C1C' }} />
              {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
            <button 
              onClick={() => toggleCompare(product)}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <GitCompare size={16} style={{ color: isCompared ? '#D4AF37' : '#1C1C1C' }} />
              {isCompared ? 'Added to Compare' : 'Add to Compare'}
            </button>
          </div>

          {/* Brand trust factors cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            backgroundColor: '#F9F5EA',
            border: '1px solid #E5D5B3',
            padding: '20px',
            borderRadius: '4px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Truck size={20} style={{ color: '#6B1D2F', marginBottom: '8px' }} />
              <h5 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Global Shipping</h5>
              <p style={{ fontSize: '10px', color: '#767676' }}>USA, UK, Europe, Australia</p>
            </div>
            <div style={{ borderLeft: '1px solid #E5D5B3', borderRight: '1px solid #E5D5B3', textAlign: 'center' }}>
              <Award size={20} style={{ color: '#6B1D2F', marginBottom: '8px' }} />
              <h5 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>100% Authentic</h5>
              <p style={{ fontSize: '10px', color: '#767676' }}>Hand-crafted in Rajasthan</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Undo2 size={20} style={{ color: '#6B1D2F', marginBottom: '8px' }} />
              <h5 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Easy Returns</h5>
              <p style={{ fontSize: '10px', color: '#767676' }}>30 Days satisfaction warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout section (Specs, Video, Reviews) */}
      <div className="details-tabs">
        <div className="tabs-headers">
          <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
            Description
          </button>
          <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
            Specifications
          </button>
          <button className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
            Video Option
          </button>
          <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            Reviews ({product.reviews ? product.reviews.length : 0})
          </button>
        </div>

        <div className="tab-content" style={{ backgroundColor: '#fff', border: '1px solid #E5D5B3', borderTop: 'none', padding: '30px' }}>
          
          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <div>
              <h4 style={{ color: '#6B1D2F', marginBottom: '15px' }}>Heritage & Craftsmanship</h4>
              <p style={{ color: '#767676', fontSize: '14px', lineHeight: 1.7, marginBottom: '15px' }}>
                Every single creation in the Shekhawati Collection carries a history. Our artisans employ centuries-old carving techniques, authentic natural extracts, or handloom looms that have been passed down for generations in the desert cities of Rajasthan.
              </p>
              <p style={{ color: '#767676', fontSize: '14px', lineHeight: 1.7 }}>
                This product is designed with a premium, royal style to build immediate trust and elevate the aesthetic aura of your wardrobe or home. We source materials ethically and support direct fair-trade artisan wages.
              </p>
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div>
              <h4 style={{ color: '#6B1D2F', marginBottom: '15px' }}>Technical details</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #F0EDE4' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600, color: '#767676', width: '30%', textTransform: 'capitalize' }}>{key}</td>
                      <td style={{ padding: '10px 0', color: '#1C1C1C' }}>{val}</td>
                    </tr>
                  ))}
                  <tr style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '10px 0', fontWeight: 600, color: '#767676' }}>Shipping Locations</td>
                    <td style={{ padding: '10px 0', color: '#1C1C1C' }}>United States, United Kingdom, Europe, Canada, Australia, Worldwide</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: VIDEO PLAYBACK */}
          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ color: '#6B1D2F', marginBottom: '15px', alignSelf: 'flex-start' }}>Video Tour</h4>
              {product.videoUrl ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '340px', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                  <video 
                    src={product.videoUrl} 
                    controls 
                    style={{ width: '100%', height: '100%' }}
                    poster="https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800"
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: '300px',
                  backgroundColor: '#F3EFE0',
                  border: '1px dashed #E5D5B3',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#767676'
                }}>
                  <Play size={40} style={{ color: '#6B1D2F', marginBottom: '12px' }} />
                  <p>Interactive Video Tour for this product is loading...</p>
                  <span style={{ fontSize: '11px', marginTop: '5px' }}>Our studio is crafting a HD tour of this specific ornament.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
                {/* Reviews List */}
                <div>
                  <h4 style={{ color: '#6B1D2F', marginBottom: '20px' }}>Customer Reviews ({product.reviews ? product.reviews.length : 0})</h4>
                  
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <p style={{ color: '#767676', fontStyle: 'italic' }}>No reviews yet for this product. Be the first to share your experience!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                      {product.reviews.map((rev, idx) => (
                        <div key={idx} style={{ borderBottom: '1px solid #F0EDE4', paddingBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1C1C1C' }}>{rev.userName}</span>
                            <span style={{ fontSize: '12px', color: '#767676' }}>
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                            </span>
                          </div>
                          <div style={{ color: '#D4AF37', fontSize: '12px', marginBottom: '8px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} style={{ color: i < rev.rating ? '#D4AF37' : '#E2E8F0' }}>★</span>
                            ))}
                          </div>
                          <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.5 }}>{rev.comment}</p>
                          <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '11px', color: '#767676' }}>
                            <span>Was this review helpful?</span>
                            <button style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#6B1D2F' }}>
                              Yes ({rev.helpfulVotes || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Review Form */}
                <div style={{ borderLeft: '1px solid #F0EDE4', paddingLeft: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <MessageSquarePlus size={20} style={{ color: '#6B1D2F' }} />
                    <h4 style={{ color: '#6B1D2F' }}>Write a Review</h4>
                  </div>
                  
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="e.g. Sarah J."
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select 
                        className="form-control" 
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="5">5 Stars (Excellent)</option>
                        <option value="4">4 Stars (Good)</option>
                        <option value="3">3 Stars (Average)</option>
                        <option value="2">2 Stars (Poor)</option>
                        <option value="1">1 Star (Unsatisfactory)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Review Comment</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        required 
                        placeholder="Share your experience regarding craftsmanship, delivery, and quality..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-sm" 
                      style={{ width: '100%' }}
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <div className="section-header" style={{ marginBottom: '35px' }}>
            <span className="subtitle">Similar Handcrafts</span>
            <h3>Related Products</h3>
          </div>
          <div className="products-grid">
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products Grid (luxury detail) */}
      {recentlyViewed.length > 1 && (
        <div style={{ marginTop: '80px', borderTop: '1px solid #E5D5B3', paddingTop: '60px' }}>
          <div className="section-header" style={{ marginBottom: '35px' }}>
            <span className="subtitle">Your History</span>
            <h3>Recently Viewed</h3>
          </div>
          <div className="products-grid">
            {recentlyViewed.filter(p => p._id !== product._id).slice(0, 4).map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
