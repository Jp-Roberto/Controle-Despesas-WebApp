import React, { useState } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useTheme } from '../contexts/ThemeContext';
import Modal from './Modal';
import CategoryChart from './CategoryChart';
import Button from './ui/Button';
import Card from './ui/Card';
import { FiCreditCard } from 'react-icons/fi';
import './TotalsDashboard.module.css';
import { useAuth } from '../contexts/AuthContext';

function TotalsDashboard() {
  const { expenses, closeBill } = useExpenses();
  const { textColorPrimary, textColorSecondary } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();

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
    <Card className="totals-dashboard-modern">
      <div className="totals-dashboard-header">
        <div className="totals-dashboard-icon">
          <FiCreditCard size={32} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          <div className="totals-dashboard-balance">R$ {totalAmount.toFixed(2)}</div>
          <div className="totals-dashboard-balance-label">Fatura atual</div>
        </div>
        {currentUser?.isAdmin && (
          <Button onClick={() => setIsModalOpen(true)} disabled={isLoading} style={{ marginLeft: 8, minWidth: 110 }}>
            {isLoading ? 'Fechando...' : 'Fechar Fatura'}
          </Button>
        )}
      </div>
      <div className="totals-dashboard-title" style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700, fontSize: '1.13rem', color: 'var(--color-primary-dark, #4c1d95)' }}>
        Resumo da Fatura
      </div>
      <div className="totals-dashboard-chart-section">
        <CategoryChart
          data={chartData}
          textColorPrimary={textColorPrimary}
          textColorSecondary={textColorSecondary}
        />
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
    </Card>
  );
}

export default TotalsDashboard;
