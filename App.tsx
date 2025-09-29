
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, Category, TransactionType } from './types';
import { DEFAULT_CATEGORIES, MONTH_NAMES_ES } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ReportModal } from './components/ReportModal';
import { Notification } from './components/Notification';
import { EditTransactionModal } from './components/EditTransactionModal';
import { ChartBarIcon } from './components/icons';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [missingHabitualExpenses, setMissingHabitualExpenses] = useState<Transaction[]>([]);
  
  // State for editing transactions
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const currentMonthTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date + 'T00:00:00');
        return transactionDate.getMonth() === currentDate.getMonth() &&
               transactionDate.getFullYear() === currentDate.getFullYear();
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentDate]);

  const { totalIncome, totalExpense, totalSavingsARS, totalSavingsUSD, balance } = useMemo(() => {
    const income = currentMonthTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = currentMonthTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const savingsARS = currentMonthTransactions.filter(t => t.type === TransactionType.SAVING && t.currency !== 'USD').reduce((sum, t) => sum + t.amount, 0);
    const savingsUSD = currentMonthTransactions.filter(t => t.type === TransactionType.SAVING && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, totalSavingsARS: savingsARS, totalSavingsUSD: savingsUSD, balance: income - expense };
  }, [currentMonthTransactions]);

  const checkHabitualExpenses = useCallback(() => {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lastMonth = lastMonthDate.getMonth();
      const lastMonthYear = lastMonthDate.getFullYear();

      const lastMonthHabitual = transactions.filter(t => {
          const tDate = new Date(t.date + 'T00:00:00');
          return t.isHabitual && tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
      });

      const currentMonthDescriptions = new Set(
          currentMonthTransactions.map(t => t.description.toLowerCase().trim())
      );

      const missing = lastMonthHabitual.filter(
          lt => !currentMonthDescriptions.has(lt.description.toLowerCase().trim())
      );
      
      setMissingHabitualExpenses(missing);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, currentDate, currentMonthTransactions]);


  useEffect(() => {
    checkHabitualExpenses();
  }, [checkHabitualExpenses]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
      setTransactions(prev => 
          prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
      setEditingTransaction(null); // Close modal on update
  };

  const changeMonth = (offset: number) => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() + offset);
          return newDate;
      })
  }

  const currentMonthName = MONTH_NAMES_ES[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">&lt;</button>
            <h2 className="text-2xl font-bold w-48 text-center">{currentMonthName} {currentYear}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">&gt;</button>
          </div>
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ChartBarIcon className="w-5 h-5"/>
            Ver Reporte
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-green-800 dark:text-green-200">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">Gastos del Mes</p>
              <p className="text-2xl font-semibold text-red-800 dark:text-red-200">{formatCurrency(totalExpense)}</p>
            </div>
             <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Ahorros del Mes</p>
              <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">{formatCurrency(totalSavingsARS)}</p>
               {totalSavingsUSD > 0 && <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mt-1">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(totalSavingsUSD)}</p>}
            </div>
            <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-orange-100 dark:bg-orange-900/50'}`}>
              <p className={`text-sm ${balance >= 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-orange-700 dark:text-orange-300'}`}>Balance</p>
              <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-indigo-800 dark:text-indigo-200' : 'text-orange-800 dark:text-orange-200'}`}>{formatCurrency(balance)}</p>
            </div>
        </div>
        
        <Notification missingExpenses={missingHabitualExpenses} onDismiss={() => setMissingHabitualExpenses([])} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <TransactionForm onAddTransaction={handleAddTransaction} categories={categories} />
          </div>
          <div className="lg:col-span-3">
            <TransactionList 
              transactions={currentMonthTransactions} 
              categories={categories} 
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={setEditingTransaction}
            />
          </div>
        </div>
      </main>
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setReportModalOpen(false)}
        transactions={currentMonthTransactions}
        categories={categories}
      />
      <EditTransactionModal 
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        categories={categories}
      />
    </div>
  );
};

export default App;
