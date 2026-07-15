import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    _id,
    title,
    city,
    rentAmount,
    bedrooms,
    bathrooms,
    images,
    propertyType,
    listingType
  } = property;

  // Read initial bookmark state from localstorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(_id));
  }, [_id]);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updatedBookmarks;
    if (bookmarks.includes(_id)) {
      updatedBookmarks = bookmarks.filter(id => id !== _id);
      setIsBookmarked(false);
    } else {
      updatedBookmarks = [...bookmarks, _id];
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const cardStyle = {
    background: 'var(--white)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--slate-200)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'var(--transition-normal)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };

  const imgContainerStyle = {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: 'var(--slate-100)'
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-normal)'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--primary-base)',
    color: 'var(--white)',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    zIndex: 2
  };

  const bookmarkBtnStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isBookmarked ? 'var(--accent-purple)' : 'var(--slate-600)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-fast)',
    zIndex: 2
  };

  const contentStyle = {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  };

  // Get first image or fallback
  const displayImage = images && images.length > 0 
    ? (images[0].startsWith('http') ? images[0] : `http://localhost:8000${images[0]}`) 
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      style={cardStyle} 
      onClick={() => navigate(`/properties/${_id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <div style={imgContainerStyle}>
        <div style={badgeStyle}>{propertyType}</div>
        <button style={bookmarkBtnStyle} onClick={toggleBookmark}>
          <svg width="20" height="20" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        <img src={displayImage} alt={title} style={imgStyle} />
      </div>

      <div style={contentStyle}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-base)' }}>
              ₹{rentAmount.toLocaleString()}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-500)' }}>/mo</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'capitalize' }}>
              {listingType}
            </span>
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{city}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-600)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <strong>{bedrooms}</strong> Bed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
              </svg>
              <strong>{bathrooms}</strong> Bath
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${_id}`);
            }}
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
