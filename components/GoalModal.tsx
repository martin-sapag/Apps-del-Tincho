
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { XMarkIcon } from './icons';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id'> | Goal) => void;
  goal: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, goal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setDescription(goal.description);
      setTargetAmount(String(goal.targetAmount));
    } else {
      setName('');
      setDescription('');
      setTargetAmount('');
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      alert('Por favor, complete el nombre y el monto objetivo.');
      return;
    }

    const goalData = {
      name,
      description,
      targetAmount: parseFloat(targetAmount),
    };

    if (goal) {
      onSave({ ...goal, ...goalData });
    } else {
      onSave(goalData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {goal ? 'Editar Objetivo' : 'Nuevo Objetivo'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="goal-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Nombre del Objetivo</label>
              <input
                type="text"
                id="goal-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: Vacaciones de verano"
                required
              />
            </div>
            <div>
              <label htmlFor="goal-description" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Descripción (Opcional)</label>
              <input
                type="text"
                id="goal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Un viaje a la costa"
              />
            </div>
            <div>
              <label htmlFor="goal-targetAmount" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Monto Objetivo (ARS)</label>
              <input
                type="number"
                id="goal-targetAmount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="50000.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {goal ? 'Guardar Cambios' : 'Crear Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
