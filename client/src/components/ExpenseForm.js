import React from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';

// Definir as categorias disponíveis
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
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [responsible, setResponsible] = React.useState('');
  const [date, setDate] = React.useState('');
  const [category, setCategory] = React.useState(''); // Novo estado para categoria
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!description) newErrors.description = 'Descrição é obrigatória.';
    if (!amount) newErrors.amount = 'Valor é obrigatório.';
    if (!responsible) newErrors.responsible = 'Responsável é obrigatório.';
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
        responsible,
        date,
        category, // Incluir categoria
      });
      setDescription('');
      setAmount('');
      setResponsible('');
      setDate('');
      setCategory(''); // Limpar categoria após adicionar
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      setErrors({ form: "Ocorreu um erro ao adicionar a despesa." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Adicionar Nova Despesa</h2>
      {errors.form && <p className="error-message">{errors.form}</p>}
      <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} />
      {errors.description && <p className="error-message">{errors.description}</p>}
      <input type="number" placeholder="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isLoading} />
      {errors.amount && <p className="error-message">{errors.amount}</p>}
      <select value={responsible} onChange={(e) => setResponsible(e.target.value)} disabled={isLoading}>
        <option value="">Selecione o Responsável</option>
        {familyMembers.map(member => (
          <option key={member.uid} value={member.email}>
            {member.name || member.email}
          </option>
        ))}
      </select>
      {errors.responsible && <p className="error-message">{errors.responsible}</p>}
      <input type="date" placeholder="Data da Compra" value={date} onChange={(e) => setDate(e.target.value)} disabled={isLoading} />
      {errors.date && <p className="error-message">{errors.date}</p>}
      {/* Novo campo de categoria */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isLoading}>
        <option value="">Selecione a Categoria</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errors.category && <p className="error-message">{errors.category}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}

export default ExpenseForm;