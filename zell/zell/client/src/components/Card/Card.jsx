import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div className={`card ${hover ? 'hover-lift' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};
