import React, { useState } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useTheme } from '../contexts/ThemeContext'; // Importar useTheme
import Modal from './Modal';
import CategoryChart from './CategoryChart';

function TotalsDashboard() {
  const { expenses, closeBill } = useExpenses();
  const { textColorPrimary, textColorSecondary } = useTheme(); // Obter cores do tema
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

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

        {chartData.length > 0 && (
          <div className="category-chart-section">
            <CategoryChart
              data={chartData}
              textColorPrimary={textColorPrimary} // Passar cor primária
              textColorSecondary={textColorSecondary} // Passar cor secundária
            />
          </div>
        )}
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
