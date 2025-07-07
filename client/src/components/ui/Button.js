import React from 'react';
import './Button.css';

function Button({ children, className = '', style = {}, variant = 'primary', ...props }) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button; 