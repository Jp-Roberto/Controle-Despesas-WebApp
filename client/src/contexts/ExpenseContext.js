import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useFamily } from './FamilyContext';

const ExpenseContext = createContext();

export function useExpenses() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const { currentUser } = useAuth();
  const { familyGroup, loadingFamily } = useFamily();

  useEffect(() => {
    if (!currentUser || loadingFamily || !familyGroup) {
      setExpenses([]);
      setArchivedExpenses([]);
      return;
    }

    const q = query(
      collection(db, 'expenses'),
      where('familyGroupId', '==', familyGroup.id),
      where('archived', '==', false),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    });

    const qArchived = query(
      collection(db, 'expenses'),
      where('familyGroupId', '==', familyGroup.id),
      where('archived', '==', true),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeArchived = onSnapshot(qArchived, (snapshot) => {
      const archivedExpensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArchivedExpenses(archivedExpensesData);
    });

    return () => {
      unsubscribe();
      unsubscribeArchived();
    };
  }, [currentUser, familyGroup, loadingFamily]);

  const addExpense = async (expense) => {
    if (!currentUser || !familyGroup) return;
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      userId: currentUser.uid,
      familyGroupId: familyGroup.id,
      archived: false,
      timestamp: serverTimestamp(),
    });
  };

  const deleteExpense = async (id) => {
    if (!currentUser || !familyGroup) return;
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const closeBill = async () => {
    if (!currentUser || !familyGroup) return;

    if (expenses.length === 0) {
      // Não há despesas para fechar. Opcional: mostrar uma mensagem de erro para o usuário
      return;
      return;
    }

    const batch = writeBatch(db);
    expenses.forEach(expense => {
      const expenseRef = doc(db, 'expenses', expense.id);
      batch.update(expenseRef, { archived: true });
    });

    try {
      await batch.commit();
      // Opcional: mostrar uma mensagem de sucesso para o usuário
    } catch (error) {
      console.error('Error closing bill:', error);
      // Opcional: mostrar uma mensagem de erro para o usuário
    }
  };

  const value = {
    expenses,
    archivedExpenses,
    addExpense,
    deleteExpense,
    closeBill,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}
