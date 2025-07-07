import React from 'react';
import Avatar from './Avatar';
import './Sidebar.css';

function Sidebar({ user, menuItems = [], onMenuClick, activeItem, className = '', style = {} }) {
  return (
    <aside className={`ui-sidebar ${className}`} style={style}>
      <div className="ui-sidebar-avatar">
        <Avatar name={user?.name} src={user?.avatar} size={72} />
        <div className="ui-sidebar-username">{user?.name || 'Usuário'}</div>
      </div>
      <nav className="ui-sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`ui-sidebar-menu-item${activeItem === item.key ? ' active' : ''}`}
            onClick={() => onMenuClick?.(item.key)}
            type="button"
          >
            {item.icon && <span className="ui-sidebar-menu-icon">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar; 