
import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { XMarkIcon, SparklesIcon } from './icons';
import { analyzeFinancialsWithGemini } from '../services/geminiService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
}

const formatCurrency = (amount: number, currency: string = 'ARS') => new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);

// This component must be defined outside ReportModal to avoid re-creation on renders
const AnalysisDisplay: React.FC<{ content: string }> = ({ content }) => {
  // A simple markdown-to-html parser
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\n/g, '<br />'); // Newlines

  return (
    <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: formattedContent }} />
  );
};

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, transactions, categories }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reportData = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const savingsTransactions = transactions.filter(t => t.type === TransactionType.SAVING);
    const totalSavingsARS = savingsTransactions.filter(t => t.currency !== 'USD').reduce((sum, t) => sum + t.amount, 0);
    const totalSavingsUSD = savingsTransactions.filter(t => t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      // FIX: Explicitly typing the accumulator in `reduce` to fix type inference issues.
      .reduce((acc: Record<string, number>, t) => {
        const categoryName = categories.find(c => c.id === t.categoryId)?.name || 'Sin Categoría';
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {});

    const savingsByCategory = savingsTransactions
        // FIX: Explicitly typing the accumulator in `reduce` to fix type inference issues.
        .reduce((acc: Record<string, { amount: number; currency: 'ARS' | 'USD' }>, t) => {
            const categoryName = categories.find(c => c.id === t.categoryId)?.name || 'Sin Categoría';
            const currency = t.currency || 'ARS';
            const key = `${categoryName}_${currency}`;
            if (!acc[key]) {
                acc[key] = { amount: 0, currency };
            }
            acc[key].amount += t.amount;
            return acc;
        }, {});

    return { 
      totalIncome, 
      totalExpense, 
      totalSavingsARS,
      totalSavingsUSD,
      balance, 
      expensesByCategory,
      savingsByCategory,
    };
  }, [transactions, categories]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis('');
    const reportString = `
      - Ingresos Totales: ${formatCurrency(reportData.totalIncome)}
      - Gastos Totales: ${formatCurrency(reportData.totalExpense)}
      - Ahorros Totales (ARS): ${formatCurrency(reportData.totalSavingsARS, 'ARS')}
      - Ahorros Totales (USD): ${formatCurrency(reportData.totalSavingsUSD, 'USD')}
      - Balance (Ingresos - Gastos): ${formatCurrency(reportData.balance)}
      - Desglose de Gastos por Categoría:
        ${Object.entries(reportData.expensesByCategory).map(([cat, amount]) => `${cat}: ${formatCurrency(amount)}`).join('\n        ')}
      - Desglose de Ahorros por Categoría:
        ${Object.entries(reportData.savingsByCategory).map(([key, data]) => {
          const [categoryName] = key.split('_');
          return `${categoryName} (${data.currency}): ${formatCurrency(data.amount, data.currency)}`;
        }).join('\n        ')}
    `;
    const result = await analyzeFinancialsWithGemini(reportString);
    setAnalysis(result);
    setIsLoading(false);
  };
  
  if (!isOpen) return null;

  const { totalIncome, totalExpense, totalSavingsARS, totalSavingsUSD, balance, expensesByCategory, savingsByCategory } = reportData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all animate-fade-in-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reporte Mensual</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Ingresos</p>
              <p className="text-xl font-semibold text-green-800 dark:text-green-200">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">Gastos</p>
              <p className="text-xl font-semibold text-red-800 dark:text-red-200">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Ahorros</p>
              <p className="text-xl font-semibold text-blue-800 dark:text-blue-200">{formatCurrency(totalSavingsARS)}</p>
               {totalSavingsUSD > 0 && <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(totalSavingsUSD, 'USD')}</p>}
            </div>
            <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-orange-100 dark:bg-orange-900/50'}`}>
              <p className={`text-sm ${balance >= 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-orange-700 dark:text-orange-300'}`}>Balance</p>
              <p className={`text-xl font-semibold ${balance >= 0 ? 'text-indigo-800 dark:text-indigo-200' : 'text-orange-800 dark:text-orange-200'}`}>{formatCurrency(balance)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Gastos por Categoría</h3>
              <div className="bg-white dark:bg-slate-700 p-4 rounded-lg">
                {Object.keys(expensesByCategory).length > 0 ? (
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <tbody>
                    {Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a).map(([category, amount]) => (
                        <tr key={category} className="border-b border-slate-100 dark:border-slate-600">
                          <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{category}</th>
                          <td className="px-4 py-3 text-right">{formatCurrency(amount)}</td>
                          <td className="px-4 py-3 text-right text-xs w-24">{totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">Sin gastos este mes.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Ahorros por Categoría</h3>
              <div className="bg-white dark:bg-slate-700 p-4 rounded-lg">
                {Object.keys(savingsByCategory).length > 0 ? (
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <tbody>
                    {Object.entries(savingsByCategory).sort(([, a], [, b]) => b.amount - a.amount).map(([key, data]) => {
                       const [categoryName] = key.split('_');
                       const percentage = data.currency === 'USD'
                            ? (totalSavingsUSD > 0 ? ((data.amount / totalSavingsUSD) * 100).toFixed(1) : 0)
                            : (totalSavingsARS > 0 ? ((data.amount / totalSavingsARS) * 100).toFixed(1) : 0);
                        return (
                          <tr key={key} className="border-b border-slate-100 dark:border-slate-600">
                            <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{categoryName}</th>
                            <td className="px-4 py-3 text-right">{formatCurrency(data.amount, data.currency)}</td>
                            <td className="px-4 py-3 text-right text-xs w-24">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">Sin ahorros este mes.</p>}
              </div>
            </div>
          </div>
          
          <div>
             <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Análisis Financiero con IA</h3>
             <div className="bg-indigo-50 dark:bg-slate-700 p-4 rounded-lg min-h-[120px]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-indigo-600 dark:text-indigo-300 animate-pulse">Analizando tus finanzas...</p>
                    </div>
                )}
                {analysis && !isLoading && <AnalysisDisplay content={analysis} />}
                {!analysis && !isLoading && (
                    <div className="text-center">
                        <p className="text-slate-500 dark:text-slate-400 mb-3">Obtén consejos personalizados sobre tu situación financiera.</p>
                        <button onClick={handleAnalyze} disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
                            <SparklesIcon className="w-5 h-5"/>
                            Generar Análisis
                        </button>
                    </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
