import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styles from './HeaderMenu.module.css';

function HeaderMenu({ onShowPersonTotals }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.headerMenu}>
      <button onClick={onShowPersonTotals} className={styles.menuButton}>Divisão por Pessoa</button>
      <button onClick={logout} className={styles.menuButton}>Sair</button>
      <button onClick={toggleTheme} className={styles.menuButton}>
        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      </button>
    </div>
  );
}

export default HeaderMenu;