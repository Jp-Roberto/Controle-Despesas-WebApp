import React from 'react';
import './Card.css';

function Card({ children, className = '', style = {}, ...props }) {
  return (
    <div
      className={`ui-card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card; 