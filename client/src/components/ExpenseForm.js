import React from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import './ExpenseForm.module.css';
import { FiEdit2, FiDollarSign, FiUser, FiCalendar, FiTag } from 'react-icons/fi';

// Categorias disponíveis
const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Contas',
  'Outros',
];

function ExpenseForm() {
  const { addExpense } = useExpenses();
  const { familyMembers = [] } = useFamily();
  const { currentUser } = useAuth();
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [responsible, setResponsible] = React.useState(currentUser?.isAdmin ? '' : (currentUser?.email || ''));
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [date, setDate] = React.useState(getToday());
  const [category, setCategory] = React.useState(''); // Novo estado para categoria
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!description) newErrors.description = 'Descrição é obrigatória.';
    if (!amount) newErrors.amount = 'Valor é obrigatório.';
    if (currentUser?.isAdmin && !responsible) newErrors.responsible = 'Responsável é obrigatório.';
    if (!date) newErrors.date = 'Data é obrigatória.';
    if (!category) newErrors.category = 'Categoria é obrigatória.'; // Validação para categoria

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      await addExpense({
        description,
        amount: parseFloat(amount),
        responsible: currentUser?.isAdmin ? responsible : (currentUser?.email || ''),
        date,
        category, // Incluir categoria
      });
      setDescription('');
      setAmount('');
      setResponsible(currentUser?.isAdmin ? '' : (currentUser?.email || ''));
      setDate(getToday());
      setCategory(''); // Limpar categoria após adicionar
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      setErrors({ form: "Ocorreu um erro ao adicionar a despesa." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form-modern">
      {/* Removido título duplicado, pois já existe no modal */}
      {errors.form && <p className="expense-form-error-message">{errors.form}</p>}

      {/* Campo: Descrição */}
      <div className="expense-form-field">
        <span className="expense-form-icon"><FiEdit2 /></span>
        <input
          type="text"
          className="expense-form-input"
          placeholder="Descrição"
          style={{ textAlign: 'center' }}
          id="desc-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
      </div>
      {errors.description && <p className="expense-form-error-message">{errors.description}</p>}

      {/* Campo: Valor */}
      <div className="expense-form-field">
        <span className="expense-form-icon"><FiDollarSign /></span>
        <input
          type="number"
          className="expense-form-input"
          placeholder="Valor (R$)"
          style={{ textAlign: 'center' }}
          id="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
      </div>
      {errors.amount && <p className="expense-form-error-message">{errors.amount}</p>}

      {/* Campo: Responsável (apenas admin) */}
      {currentUser?.isAdmin && (
        <div className="expense-form-field">
          <span className="expense-form-icon"><FiUser /></span>
          <select
            className="expense-form-select"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            disabled={isLoading}
            id="resp-input"
            style={{ textAlign: 'center' }}
          >
            <option value="">Responsável</option>
            {familyMembers.map(member => (
              <option key={member.uid} value={member.email}>
                {member.name || member.email}
              </option>
            ))}
          </select>
        </div>
      )}
      {errors.responsible && <p className="expense-form-error-message">{errors.responsible}</p>}

      {/* Campo: Data */}
      <div className="expense-form-field">
        <span className="expense-form-icon"><FiCalendar /></span>
        <input
          type="date"
          className="expense-form-input"
          placeholder="Data"
          style={{ textAlign: 'center' }}
          id="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isLoading}
        />
      </div>
      {errors.date && <p className="expense-form-error-message">{errors.date}</p>}

      {/* Campo: Categoria */}
      <div className="expense-form-field">
        <span className="expense-form-icon"><FiTag /></span>
        <select
          className="expense-form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
          id="cat-input"
          style={{ textAlign: 'center' }}
        >
          <option value="">Categoria</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {errors.category && <p className="expense-form-error-message">{errors.category}</p>}

      <Button type="submit" disabled={isLoading} style={{ marginTop: 10 }}>
        {isLoading ? 'Adicionando...' : 'Adicionar'}
      </Button>
    </form>
  );
}

export default ExpenseForm;