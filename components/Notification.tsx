
import React from 'react';
import { Transaction } from '../types';
import { BellIcon, XMarkIcon } from './icons';

interface NotificationProps {
  missingExpenses: Transaction[];
  onDismiss: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ missingExpenses, onDismiss }) => {
  if (missingExpenses.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg shadow-md" role="alert">
      <div className="flex">
        <div className="py-1"><BellIcon className="w-6 h-6 text-yellow-500 mr-4"/></div>
        <div>
          <p className="font-bold">Alerta de Gastos Habituales</p>
          <p className="text-sm">
            Parece que aún no has registrado los siguientes gastos habituales este mes:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm">
            {missingExpenses.map(expense => (
              <li key={expense.id}>{expense.description}</li>
            ))}
          </ul>
        </div>
        <button onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-yellow-500 hover:bg-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 inline-flex h-8 w-8" aria-label="Cerrar">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
