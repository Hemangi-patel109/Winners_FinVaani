'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import type { CategorizeExpenseOutput } from '@/ai/flows/categorize-expenses';
import { getInitialTransactions } from '@/services/mcp';

export interface Expense extends CategorizeExpenseOutput {
  id: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionsContextType {
  transactions: Expense[];
  addTransaction: (transaction: CategorizeExpenseOutput) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Expense[]>([]);

  useEffect(() => {
    // In a real app, this would be an async call to an API
    setTransactions(getInitialTransactions());
  }, []);

  const addTransaction = useCallback((transactionData: CategorizeExpenseOutput) => {
    const newTransaction: Expense = {
      ...transactionData,
      id: new Date().toISOString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

    