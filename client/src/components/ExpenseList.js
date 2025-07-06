import React, { useState } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';
import Modal from './Modal'; // Importando o modal

function ExpenseList() {
  const { expenses, deleteExpense } = useExpenses();
  const { familyMembers = [] } = useFamily();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const memberNameMap = familyMembers.reduce((map, member) => {
    map[member.email] = member.name || member.email;
    return map;
  }, {});

  // Abre o modal e define a despesa a ser excluída
  const handleDeleteClick = (id) => {
    setSelectedExpenseId(id);
    setIsModalOpen(true);
  };

  // Fecha o modal sem fazer nada
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpenseId(null);
  };

  // Confirma a exclusão e fecha o modal
  const handleConfirmDelete = () => {
    if (selectedExpenseId) {
      deleteExpense(selectedExpenseId);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="expense-list">
        <h2>Histórico de Despesas</h2>
        <ul>
          {expenses.map(expense => (
            <li key={expense.id}>
              <span>{expense.description}</span>
              <span>{expense.date}</span>
              <span>{expense.category}</span> {/* Exibir a categoria */}
              <span>R$ {expense.amount.toFixed(2)}</span>
              <span>({memberNameMap[expense.responsible] || expense.responsible})</span>
              <button onClick={() => handleDeleteClick(String(expense.id))} className="delete-btn">X</button>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
      >
        <p>Você tem certeza que deseja excluir esta despesa?</p>
        <p>Esta ação não poderá ser desfeita.</p>
      </Modal>
    </>
  );
}

export default ExpenseList;