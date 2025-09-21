import React from 'react';
import '../styles/header.css';

const Header = ({ title = 'This Week', subtitle }) => {
  const getDefaultSubtitle = () => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);
    
    const startStr = startOfWeek.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endStr = endOfWeek.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  return (
    <div className="header">
      <div className="week-title">{title}</div>
      <div className="week-subtitle">{subtitle || getDefaultSubtitle()}</div>
    </div>
  );
};

export default Header;
