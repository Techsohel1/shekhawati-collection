import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Layers, AlertCircle, Sparkles } from 'lucide-react';

const Products = ({ 
  products, 
  formatPrice, 
  handleDeleteProduct,
  handleAddProduct,
  newProdName, setNewProdName,
  newProdPrice, setNewProdPrice,
  newProdCategory, setNewProdCategory,
  newProdStock, setNewProdStock,
  newProdDesc, setNewProdDesc,
  newProdImage, setNewProdImage,
  newProdSpecs, setNewProdSpecs,
  submittingProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jsonError, setJsonError] = useState(null);

  // Validate specifications JSON on inputs change
  const handleSpecsChange = (value) => {
    setNewProdSpecs(value);
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  // Filter products by name or category
  const filteredProducts = products.filter(p => {
    const term = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 0.8fr',
      gap: '30px',
      alignItems: 'stretch'
    }}>
      
      {/* 1. LEFT PANEL: Active Catalog List */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600 }}>Active Catalog</h4>
            <span style={{ fontSize: '12px', color: '#767676' }}>Manage store product items and stock profiles</span>
          </div>
          <span style={{
            backgroundColor: 'rgba(107, 29, 47, 0.08)',
            color: '#6B1D2F',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            {products.length} Items Listed
          </span>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          gap: '12px',
          backgroundColor: '#FAF8F3',
          border: '1px solid #E5D5B3',
          borderRadius: '6px',
          padding: '10px 14px',
          alignItems: 'center'
        }}>
          <Search size={16} style={{ color: '#767676' }} />
          <input 
            type="text"
            placeholder="Search products by title, category, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              width: '100%',
              color: '#1C1C1C',
              outline: 'none'
            }}
          />
        </div>

        {/* Catalog List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxHeight: '62vh',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '40px 10px', textAlign: 'center', color: '#767676' }}>
              No products found.
            </div>
          ) : (
            filteredProducts.map(p => (
              <div 
                key={p._id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  border: '1px solid #FAF8F3',
                  padding: '12px',
                  borderRadius: '6px',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#FAF8F3';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail */}
                <img 
                  src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800'} 
                  alt={p.name} 
                  style={{
                    width: '54px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #FAF8F3',
                    backgroundColor: '#FAF8F3'
                  }}
                />

                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <strong style={{ fontSize: '14px', color: '#1C1C1C' }}>{p.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#D4AF37', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <Tag size={10} /> {p.category}
                    </span>
                    <span style={{ color: '#767676' }}>•</span>
                    <span style={{
                      color: p.stock === 0 ? '#EF4444' : p.stock < 5 ? '#F59E0B' : '#767676',
                      fontWeight: p.stock < 5 ? 600 : 400
                    }}>
                      Stock: <strong>{p.stock}</strong> units {p.stock === 0 && '(Out of stock)'}
                    </span>
                  </div>
                </div>

                {/* Price tag */}
                <div style={{ fontWeight: 700, color: '#6B1D2F', fontSize: '14.5px', paddingRight: '12px' }}>
                  {formatPrice(p.price)}
                </div>

                {/* Trash */}
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  title="Delete from Catalog"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Add Product Form */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} style={{ color: '#D4AF37' }} /> Add New Product
          </h4>
          <span style={{ fontSize: '12px', color: '#767676' }}>Create a new handcrafted listing in the inventory</span>
        </div>

        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Product Name *
            </label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={newProdName} 
              onChange={(e) => setNewProdName(e.target.value)} 
              placeholder="e.g. Hand-Carved Teakwood Swing"
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
                Price (USD) *
              </label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                required 
                value={newProdPrice} 
                onChange={(e) => setNewProdPrice(e.target.value)} 
                placeholder="249.99"
                style={{
                  padding: '10px 12px',
                  border: '1px solid #E5D5B3',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
                Stock Count *
              </label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={newProdStock} 
                onChange={(e) => setNewProdStock(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #E5D5B3',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Collection Category *
            </label>
            <select 
              className="form-control" 
              value={newProdCategory} 
              onChange={(e) => setNewProdCategory(e.target.value)} 
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <option value="Wooden Items">Wooden Items</option>
              <option value="Artificial Jewellery">Artificial Jewellery</option>
              <option value="Herbal Products">Herbal Products</option>
              <option value="Ladies Suits">Ladies Suits</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Core Display Image URL
            </label>
            <input 
              type="text" 
              className="form-control" 
              value={newProdImage} 
              onChange={(e) => setNewProdImage(e.target.value)} 
              placeholder="Leave blank for default premium mockup..."
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Item Description *
            </label>
            <textarea 
              className="form-control" 
              rows="3" 
              required 
              value={newProdDesc} 
              onChange={(e) => setNewProdDesc(e.target.value)} 
              placeholder="Write rich details regarding design heritage, quality, materials..."
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
                Specifications (JSON Format)
              </label>
              {jsonError ? (
                <span style={{ fontSize: '10px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <AlertCircle size={10} /> Invalid JSON
                </span>
              ) : (
                <span style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Sparkles size={10} /> Valid JSON structure
                </span>
              )}
            </div>
            <textarea 
              className="form-control" 
              rows="3" 
              value={newProdSpecs} 
              onChange={(e) => handleSpecsChange(e.target.value)} 
              style={{
                padding: '10px 12px',
                border: jsonError ? '1px solid #EF4444' : '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }} 
            disabled={submittingProduct || !!jsonError}
          >
            <Plus size={16} />
            {submittingProduct ? 'Uploading to DB...' : 'Publish Product'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Products;
