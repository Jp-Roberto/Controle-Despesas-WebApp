import React from 'react';
import './BottomBar.css';
import { FiPlus } from 'react-icons/fi';

function BottomBar({ items = [], activeItem, onMenuClick, className = '', style = {} }) {
  return (
    <nav className={`ui-bottombar ${className}`} style={style}>
      {items.map((item) => (
        <button
          key={item.key}
          className={`ui-bottombar-item${activeItem === item.key ? ' active' : ''}`}
          onClick={() => onMenuClick?.(item.key)}
          type="button"
        >
          {item.icon && <span className="ui-bottombar-icon">{item.icon}</span>}
          <span className={`ui-bottombar-label${item.key === 'add' ? ' ui-bottombar-label-add' : ''}`}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomBar; 