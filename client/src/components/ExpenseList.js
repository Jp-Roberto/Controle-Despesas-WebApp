import React from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';
import { useAuth } from '../contexts/AuthContext';
import { FiTrash2 } from 'react-icons/fi';
import './ExpenseList.module.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

function ExpenseList() {
  const { expenses, deleteExpense } = useExpenses();
  const { familyMembers = [] } = useFamily();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  const getMemberName = (email) => {
    const member = familyMembers.find((m) => m.email === email);
    return member ? member.name || member.email : email;
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list-modern-empty">
        <span role="img" aria-label="empty">🗒️</span>
        <div>Nenhuma despesa registrada.</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="expense-list-mobile-list">
        <h2 className="expense-list-title">Despesas Recentes</h2>
        <ul className="expense-list-mobile-list-ul">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="expense-list-mobile-line"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #eee',
                padding: '0.7rem 0',
                gap: 8,
              }}
            >
              <div
                className="expense-list-mobile-value"
                style={{
                  fontWeight: 700,
                  fontSize: '1.13rem',
                  color: 'var(--color-primary, #7c3aed)',
                  minWidth: 90,
                  textAlign: 'left',
                  flexShrink: 0,
                }}
              >
                R$ {expense.amount.toFixed(2)}
              </div>
              <div
                className="expense-list-mobile-meta"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  minWidth: 0,
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span
                  className="expense-list-mobile-date"
                  style={{
                    color: 'var(--color-text-secondary, #a1a1aa)',
                    fontSize: '0.93rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {expense.date}
                </span>
                <span
                  className="expense-list-mobile-user"
                  style={{
                    color: 'var(--color-primary-dark, #4c1d95)',
                    fontWeight: 600,
                    fontSize: '0.98rem',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: 120,
                  }}
                >
                  {getMemberName(expense.responsible)}
                </span>
              </div>
              {currentUser?.isAdmin && (
                <button
                  className="expense-list-delete-btn"
                  title="Excluir despesa"
                  onClick={() => deleteExpense(expense.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: 8,
                    alignSelf: 'center',
                  }}
                >
                  <FiTrash2 size={18} color="#b00020" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="expense-list-modern">
      <h2 className="expense-list-title">Despesas Recentes</h2>
      <div className="expense-list-table-wrapper">
        <table className="expense-list-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuário</th>
              <th>Valor</th>
              {currentUser?.isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="expense-list-table-row">
                <td className="expense-list-date">{expense.date}</td>
                <td className="expense-list-resp">{getMemberName(expense.responsible)}</td>
                <td className="expense-list-value">R$ {expense.amount.toFixed(2)}</td>
                {currentUser?.isAdmin && (
                  <td>
                    <button
                      className="expense-list-delete-btn"
                      title="Excluir despesa"
                      onClick={() => deleteExpense(expense.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={18} color="#b00020" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;