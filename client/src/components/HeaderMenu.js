import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './HeaderMenu.module.css';

function HeaderMenu({ onShowPersonTotals }) {
  const { logout } = useAuth();

  return (
    <div className={styles.headerMenu}>
      <button onClick={onShowPersonTotals} className={styles.menuButton}>Divisão por Pessoa</button>
      <button onClick={logout} className={styles.menuButton}>Sair</button>
    </div>
  );
}

export default HeaderMenu;