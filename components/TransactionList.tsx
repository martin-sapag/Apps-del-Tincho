
import React from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { TrashIcon, PencilIcon } from './icons';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<{
  transaction: Transaction;
  category?: Category;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}> = ({ transaction, category, onDelete, onEdit }) => {
    const isExpense = transaction.type === TransactionType.EXPENSE;
    const isSaving = transaction.type === TransactionType.SAVING;

    const amountColor = isExpense ? 'text-red-500' : isSaving ? 'text-blue-500' : 'text-green-500';
    const sign = isExpense || isSaving ? '-' : '+';
    const indicatorColor = isExpense ? 'bg-red-400' : isSaving ? 'bg-blue-400' : 'bg-green-400';
    
    const currency = transaction.type === TransactionType.SAVING ? transaction.currency || 'ARS' : 'ARS';
    const formattedAmount = new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(transaction.amount);

    return (
        <li className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-12 rounded-full ${indicatorColor}`}></div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>{new Date(transaction.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">{category?.name || 'Sin Categoría'}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className={`font-bold text-lg ${amountColor}`}>{sign}{formattedAmount}</p>
                <button
                    onClick={() => onEdit(transaction)}
                    className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Editar transacción"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Eliminar transacción"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </li>
    );
};


export const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, onDeleteTransaction, onEditTransaction }) => {
  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Últimas Transacciones</h2>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map(t => (
            <TransactionItem key={t.id} transaction={t} category={getCategory(t.categoryId)} onDelete={onDeleteTransaction} onEdit={onEditTransaction} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">No hay transacciones este mes.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Añade un gasto o ingreso para empezar.</p>
        </div>
      )}
    </div>
  );
};
