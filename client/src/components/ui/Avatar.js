import React from 'react';
import './Avatar.css';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ src, alt, name, size = 56, className = '', style = {} }) {
  return (
    <div
      className={`ui-avatar ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {src ? (
        <img src={src} alt={alt || name} className="ui-avatar-img" />
      ) : (
        <span className="ui-avatar-fallback">{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar; 