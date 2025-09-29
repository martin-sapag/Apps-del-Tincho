
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { PlusIcon } from './icons';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, categories }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState('');
  const [isHabitual, setIsHabitual] = useState(false);
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
      description,
      amount: parseFloat(amount),
      date,
      categoryId,
      type,
      isHabitual: type === TransactionType.INCOME ? false : isHabitual,
    };

    if (type === TransactionType.SAVING) {
      newTransaction.currency = currency;
    }

    onAddTransaction(newTransaction);

    // Reset form
    setDescription('');
    setAmount('');
    setCategoryId('');
    setIsHabitual(false);
    setCurrency('ARS');
  };
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId(''); // Reset category on type change
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Añadir Nueva Transacción</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.EXPENSE)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.INCOME)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.SAVING)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.SAVING ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            Ahorro
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Descripción</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200" placeholder="Ej: Supermercado" required />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Monto</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200" placeholder="0.00" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Categoría</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-slate-800 dark:text-slate-200" required>
              <option value="" disabled>Seleccione una categoría</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Fecha</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 dark:text-slate-200" required />
          </div>
        </div>

        { type === TransactionType.SAVING && (
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Moneda</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as 'ARS' | 'USD')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-slate-800 dark:text-slate-200">
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
        )}

        { (type === TransactionType.EXPENSE || type === TransactionType.SAVING) && (
          <div className="flex items-center">
            <input id="isHabitual" name="isHabitual" type="checkbox" checked={isHabitual} onChange={(e) => setIsHabitual(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
            <label htmlFor="isHabitual" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">
              Marcar como gasto/ahorro habitual
            </label>
          </div>
        )}

        <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Añadir Transacción
        </button>
      </form>
    </div>
  );
};
