
import React from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            {onConfirm ? 'Cancelar' : 'Fechar'}
          </button>
          {onConfirm && (
            <button onClick={onConfirm} className={styles.confirmButton}>
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
