
import React from 'react';
import './App.css';
import { useExpenses } from './contexts/ExpenseContext';
import { useAuth } from './contexts/AuthContext';
import { useFamily } from './contexts/FamilyContext';
import AuthForms from './components/AuthForms';
import FamilyGroupManager from './components/FamilyGroupManager';

// --- Componentes Filhos ---

function ExpenseForm() {
  const { addExpense } = useExpenses();
  const { familyMembers } = useFamily();
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [responsible, setResponsible] = React.useState('');
  const [date, setDate] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!description) newErrors.description = 'Descrição é obrigatória.';
    if (!amount) newErrors.amount = 'Valor é obrigatório.';
    if (!responsible) newErrors.responsible = 'Responsável é obrigatório.';
    if (!date) newErrors.date = 'Data é obrigatória.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Limpa os erros se a validação passar
    addExpense({
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      responsible,
      date,
    });
    setDescription('');
    setAmount('');
    setResponsible('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Adicionar Nova Despesa</h2>
      <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      {errors.description && <p className="error-message">{errors.description}</p>}
      <input type="number" placeholder="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} />
      {errors.amount && <p className="error-message">{errors.amount}</p>}
      <select value={responsible} onChange={(e) => setResponsible(e.target.value)}>
        <option value="">Selecione o Responsável</option>
        {familyMembers.map(member => (
          <option key={member.uid} value={member.email}>
            {member.email} {/* Ou member.name se você adicionar um campo de nome */}
          </option>
        ))}
      </select>
      {errors.responsible && <p className="error-message">{errors.responsible}</p>}
      <input type="date" placeholder="Data da Compra" value={date} onChange={(e) => setDate(e.target.value)} />
      {errors.date && <p className="error-message">{errors.date}</p>}
      <button type="submit">Adicionar</button>
    </form>
  );
}

function TotalsDashboard() {
  const { expenses, closeBill } = useExpenses();

  const totals = expenses.reduce((acc, expense) => {
    acc[expense.responsible] = (acc[expense.responsible] || 0) + expense.amount;
    return acc;
  }, {});

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="totals-dashboard">
      <div className="dashboard-header">
        <h2>Resumo da Fatura</h2>
        <button onClick={closeBill} className="close-bill-btn">Fechar Fatura</button>
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
  );
}

function ExpenseList() {
  const { expenses, deleteExpense } = useExpenses();

  return (
    <div className="expense-list">
      <h2>Histórico de Despesas</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            <span>{expense.description}</span>
            <span>{expense.date}</span>
            <span>R$ {expense.amount.toFixed(2)}</span>
            <span>({expense.responsible})</span>
            <button onClick={() => deleteExpense(expense.id)} className="delete-btn">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Componente Principal ---

function App() {
  const { currentUser, logout } = useAuth();
  const { familyGroup, loadingFamily } = useFamily();

  if (!currentUser) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
        </header>
        <AuthForms />
      </div>
    );
  }

  if (loadingFamily) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
          {currentUser && <button onClick={logout} className="logout-btn">Sair</button>}
        </header>
        <div className="loading-container">Carregando informações da família...</div>
      </div>
    );
  }

  if (!familyGroup) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
          {currentUser && <button onClick={logout} className="logout-btn">Sair</button>}
        </header>
        <FamilyGroupManager />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Controle de Despesas Familiares</h1>
        {currentUser && <button onClick={logout} className="logout-btn">Sair</button>}
      </header>
      <main>
        <TotalsDashboard />
        <ExpenseForm />
        <ExpenseList />
      </main>
    </div>
  );
}

export default App;
