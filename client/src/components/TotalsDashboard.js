
import React, { useState } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';
import Modal from './Modal'; // Importando o modal

function TotalsDashboard() {
  const { expenses, closeBill } = useExpenses();
  const { familyMembers = [] } = useFamily();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberNameMap = familyMembers.reduce((map, member) => {
    map[member.email] = member.name || member.email;
    return map;
  }, {});

  const totals = expenses.reduce((acc, expense) => {
    const responsibleName = memberNameMap[expense.responsible] || expense.responsible;
    acc[responsibleName] = (acc[responsibleName] || 0) + expense.amount;
    return acc;
  }, {});

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleConfirmCloseBill = async () => {
    setIsLoading(true);
    try {
      await closeBill();
    } catch (error) {
      console.error("Erro ao fechar a fatura:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="totals-dashboard">
        <div className="dashboard-header">
          <h2>Resumo da Fatura</h2>
          <button onClick={() => setIsModalOpen(true)} className="close-bill-btn" disabled={isLoading}>
            {isLoading ? 'Fechando...' : 'Fechar Fatura'}
          </button>
        </div>
        <div className="total-card">
          <h3>Total Geral</h3>
          <p>R$ {totalAmount.toFixed(2)}</p>
        </div>
        <h3>Divisão por Pessoa</h3>
        <div className="totals-by-person">
          {Object.entries(totals).map(([person, total]) => (
            <div key={person} className="person-total">
              <p>{person}:</p>
              <p>R$ {total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCloseBill}
        title="Confirmar Fechamento da Fatura"
      >
        <p>Você tem certeza que deseja fechar a fatura?</p>
        <p>Todas as despesas atuais serão arquivadas e o painel será zerado para o próximo ciclo.</p>
      </Modal>
    </>
  );
}

export default TotalsDashboard;
