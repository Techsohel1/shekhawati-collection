import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { API_URL } from '../config';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // Filter States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(300);
  const [sortBy, setSortBy] = useState('newest');

  // Parse query parameters on load/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    const searchParam = params.get('search');
    const bSellerParam = params.get('bestSeller');

    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('');
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
    
    // Default sorting adjustments
    if (bSellerParam === 'true') {
      setSortBy('rating');
    }
  }, [location.search]);

  // Fetch products from backend whenever filters/sorting parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/products?`;
        
        if (selectedCategory) {
          url += `category=${encodeURIComponent(selectedCategory)}&`;
        }
        if (searchQuery) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }
        if (sortBy) {
          url += `sort=${sortBy}&`;
        }
        if (priceMax) {
          url += `maxPrice=${priceMax}&`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching shop items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, priceMax]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceMax(300);
    setSortBy('newest');
    navigate('/shop');
  };

  const categoriesList = [
    "Wooden Items",
    "Artificial Jewellery",
    "Herbal Products",
    "Ladies Suits"
  ];

  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Heritage Catalog</span>
        <h2>Explore Shop</h2>
      </div>

      <div className="shop-layout">
        
        {/* Left Sidebar Filters */}
        <aside className="shop-sidebar">
          {/* Search box within sidebar */}
          <div className="filter-group">
            <h4 className="filter-title">Search Product</h4>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px', backgroundColor: '#fff' }}>
              <Search size={16} style={{ color: '#767676', marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Type keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }}
              />
            </div>
          </div>

          {/* Categories select list */}
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <ul className="filter-list">
              <li>
                <div 
                  className={`filter-link ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(''); navigate('/shop'); }}
                >
                  All Products <span>({products.length})</span>
                </div>
              </li>
              {categoriesList.map(cat => (
                <li key={cat}>
                  <div 
                    className={`filter-link ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory(cat); navigate(`/shop?category=${encodeURIComponent(cat)}`); }}
                  >
                    {cat}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Max Price</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
              <span>$0 USD</span>
              <span style={{ color: '#6B1D2F' }}>{formatPrice(priceMax)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--color-primary-burgundy)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Sorting */}
          <div className="filter-group">
            <h4 className="filter-title">Sort By</h4>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px', backgroundColor: '#fff' }}>
              <ArrowUpDown size={16} style={{ color: '#767676', marginRight: '10px' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', cursor: 'pointer', background: 'transparent' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          {/* Clear Button */}
          <button 
            onClick={handleClearFilters}
            className="btn btn-outline" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 0', fontSize: '12px' }}
          >
            <RefreshCw size={14} /> Reset Filters
          </button>
        </aside>

        {/* Right Product Grid */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #E5D5B3',
                borderTopColor: '#6B1D2F',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '15px', color: '#767676', fontSize: '14px' }}>Loading Royal Collection...</p>
              
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px solid #F0EDE4', backgroundColor: '#fff' }}>
              <SlidersHorizontal size={40} style={{ color: '#E5D5B3', marginBottom: '15px' }} />
              <h3>No items match your criteria</h3>
              <p style={{ color: '#767676', fontSize: '14px', marginTop: '8px' }}>Try adjusting your pricing filters or search keywords.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '20px' }}
                onClick={handleClearFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', fontSize: '14px', color: '#767676' }}>
                <p>Showing <span style={{ fontWeight: 'bold', color: '#1C1C1C' }}>{products.length}</span> luxury products</p>
                <p>Delivery: <span style={{ color: '#6B1D2F' }}>USA, UK, Europe, Canada, Australia</span></p>
              </div>

              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
