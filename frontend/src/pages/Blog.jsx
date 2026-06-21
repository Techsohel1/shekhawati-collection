import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  // Mock Blog Articles
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Sheesham Wood Carving",
      category: "Heritage Woodwork",
      desc: "Deep dive into the ancient woodcarving techniques employed by master artisans in Shekhawati. Learn how raw timber is seasoned and shaped into heirloom chests.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800",
      date: "June 18, 2026",
      author: "Aditya Singh",
      readTime: "6 Min Read"
    },
    {
      id: 2,
      title: "Kundan Jewellery: A Royal Rajasthani Legacy",
      category: "Ornaments & Jewels",
      desc: "Discover the intricate details of meenakari reverse enameling, glass gemstones setting, and gold foil borders that define Kundan jewelry.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      date: "May 29, 2026",
      author: "Ritu Shekhawat",
      readTime: "8 Min Read"
    },
    {
      id: 3,
      title: "Ayurvedic Skin Rituals: Sandalwood & Saffron",
      category: "Organic Wellness",
      desc: "Uncover the organic beauty secrets of Kashmiri Kumkumadi saffron oils and Mysore sandalwood pastes used for centuries in royal cosmetic rituals.",
      image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800",
      date: "April 14, 2026",
      author: "Dr. Ananya Sharma",
      readTime: "5 Min Read"
    },
    {
      id: 4,
      title: "Jaipuri Hand-Block Prints: Crafting Cotton Couture",
      category: "Ethnic Apparel",
      desc: "Follow the journey ofCambric cotton salwar suits printed with organic vegetable dyes using hand-carved teak wood block patterns in Jaipur.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
      date: "March 22, 2026",
      author: "Devendra Raj",
      readTime: "7 Min Read"
    }
  ];

  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Royal Chronicles</span>
        <h2>Heritage Journal</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '40px'
      }}>
        {blogPosts.map(post => (
          <article 
            key={post.id} 
            style={{
              backgroundColor: '#fff',
              border: '1px solid #E5D5B3',
              boxShadow: 'var(--shadow-premium)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Image Banner */}
            <div style={{ height: '260px', overflow: 'hidden' }}>
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            </div>

            {/* Content Details */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{
                color: '#D4AF37',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 600,
                marginBottom: '10px',
                display: 'block'
              }}>
                {post.category}
              </span>
              
              <h3 style={{ fontSize: '22px', color: '#6B1D2F', marginBottom: '15px', lineHeight: 1.3 }}>
                {post.title}
              </h3>
              
              <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.6, marginBottom: '25px' }}>
                {post.desc}
              </p>

              {/* Meta information tags */}
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#767676',
                borderTop: '1px solid #F0EDE4',
                paddingTop: '15px',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> By {post.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                
                <span style={{
                  color: '#6B1D2F',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Read Story <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
