import React from 'react';
import '../styles/page-scroll-indicator.css';

const PageScrollIndicator = ({ numberOfPages, currentPage }) => {
  return (
    <div className="page-scroll-indicator">
        <div className="dots-container">
            {Array.from({ length: numberOfPages }).map((_, index) => (
                <div key={index} className={`dot ${index === currentPage ? 'active' : ''}`}/>
            ))}
        </div>
    </div>
  );
};

export default PageScrollIndicator;
