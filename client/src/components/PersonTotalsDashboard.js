import React from 'react';
import { usePersonTotals } from '../hooks/usePersonTotals';

function PersonTotalsDashboard() {
  const totals = usePersonTotals();

  return (
    <div className="totals-dashboard"> {/* Reutilizando a classe para manter o estilo */}
      <h2>Divisão por Pessoa</h2>
      <div className="totals-by-person">
        {Object.entries(totals).map(([person, total]) => (
          <div key={person} className="person-total">
            <p>{person}:</p>
            <p>R$ {total.toFixed(2)}</p>
          </div>
        ))}
        {Object.keys(totals).length === 0 && (
          <p>Nenhuma despesa registrada para divisão.</p>
        )}
      </div>
    </div>
  );
}

export default PersonTotalsDashboard;
