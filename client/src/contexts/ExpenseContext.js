import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebaseConfig';
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
import { notifySuccess, notifyError, notifyInfo } from '../utils/notifications';

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
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        userId: currentUser.uid,
        familyGroupId: familyGroup.id,
        archived: false,
        timestamp: serverTimestamp(),
      });
      notifySuccess("Despesa adicionada com sucesso!");
    } catch (error) {
      notifyError("Erro ao adicionar despesa: " + error.message);
      console.error("Erro ao adicionar despesa:", error);
    }
  };

  const deleteExpense = async (id) => {
    if (!currentUser || !familyGroup) return;
    try {
      await deleteDoc(doc(db, 'expenses', id));
      notifySuccess("Despesa excluída com sucesso!");
    } catch (error) {
      notifyError("Erro ao excluir despesa: " + error.message);
      console.error('Error deleting expense:', error);
    }
  };

  const closeBill = async () => {
    if (!currentUser || !familyGroup) return;

    if (expenses.length === 0) {
      notifyInfo("Não há despesas para fechar.");
      return;
    }

    const batch = writeBatch(db);
    expenses.forEach(expense => {
      const expenseRef = doc(db, 'expenses', expense.id);
      batch.update(expenseRef, { archived: true });
    });

    try {
      await batch.commit();
      notifySuccess("Fatura fechada! O painel foi limpo para o próximo ciclo.");
    } catch (error) {
      notifyError("Erro ao fechar fatura: " + error.message);
      console.error('Error closing bill:', error);
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