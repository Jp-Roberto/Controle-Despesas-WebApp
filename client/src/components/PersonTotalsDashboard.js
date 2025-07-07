import React from 'react';
import { usePersonTotals } from '../hooks/usePersonTotals';
import Card from './ui/Card';

function PersonTotalsDashboard() {
  const totals = usePersonTotals();
  const isEmpty = Object.keys(totals).length === 0;

  return (
    <Card style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2 style={{
        color: 'var(--color-primary-dark, #4c1d95)',
        fontSize: '1.25rem',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '1.2rem'
      }}>
        Divisão por Pessoa
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isEmpty ? (
          Object.entries(totals).map(([person, total]) => (
            <div key={person} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--color-surface, #fff)',
              borderRadius: 'var(--radius-md, 16px)',
              boxShadow: '0 1px 3px rgba(124, 58, 237, 0.08)',
              padding: '1rem 1.2rem',
              fontSize: '1.08rem',
              fontWeight: 600,
              color: 'var(--color-text, #23213a)'
            }}>
              <span>{person}</span>
              <span style={{ color: 'var(--color-primary, #7c3aed)', fontWeight: 700 }}>R$ {total.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            color: 'var(--color-text-secondary, #a1a1aa)',
            fontSize: '1.08rem',
            padding: '2.5rem 0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>👥</div>
            Nenhuma despesa registrada para divisão.
          </div>
        )}
      </div>
    </Card>
  );
}

export default PersonTotalsDashboard;
