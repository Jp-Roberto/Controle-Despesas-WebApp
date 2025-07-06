import { useMemo } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useFamily } from '../contexts/FamilyContext';

export const usePersonTotals = () => {
  const { expenses } = useExpenses();
  const { familyMembers = [] } = useFamily();

  const totals = useMemo(() => {
    const memberNameMap = familyMembers.reduce((map, member) => {
      map[member.email] = member.name || member.email;
      return map;
    }, {});

    return expenses.reduce((acc, expense) => {
      const responsibleName = memberNameMap[expense.responsible] || expense.responsible;
      acc[responsibleName] = (acc[responsibleName] || 0) + expense.amount;
      return acc;
    }, {});
  }, [expenses, familyMembers]);

  return totals;
};