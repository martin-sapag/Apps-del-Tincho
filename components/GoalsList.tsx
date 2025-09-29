
import React from 'react';
import { Goal } from '../types';
import { PlusIcon, TrophyIcon, PencilIcon, TrashIcon } from './icons';

interface GoalsListProps {
  goals: Goal[];
  goalProgress: Record<string, number>;
  onAddNewGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

const GoalItem: React.FC<{
    goal: Goal;
    currentAmount: number;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ goal, currentAmount, onEdit, onDelete }) => {
    const progress = goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;
    const progressPercentage = Math.min(progress, 100).toFixed(1);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{goal.name}</h4>
                    {goal.description && <p className="text-sm text-slate-500 dark:text-slate-400">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                     <button
                        onClick={onEdit}
                        className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Editar objetivo"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Eliminar objetivo"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div>
                <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    <span>{formatCurrency(currentAmount)}</span>
                    <span className="text-slate-500 dark:text-slate-400">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                 <p className="text-right text-xs font-semibold text-yellow-600 dark:text-yellow-400 mt-1">{progressPercentage}%</p>
            </div>
        </div>
    );
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, goalProgress, onAddNewGoal, onEditGoal, onDeleteGoal }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <TrophyIcon className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Mis Objetivos</h2>
        </div>
        <button
          onClick={onAddNewGoal}
          className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo Objetivo
        </button>
      </div>
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              currentAmount={goalProgress[goal.id] || 0}
              onEdit={() => onEditGoal(goal)}
              onDelete={() => onDeleteGoal(goal.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">Aún no tienes objetivos definidos.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">¡Crea un objetivo para empezar a ahorrar con un propósito!</p>
        </div>
      )}
    </div>
  );
};
