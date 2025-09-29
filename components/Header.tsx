
import React from 'react';
import { ChartBarIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Finanzas Familiares
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
