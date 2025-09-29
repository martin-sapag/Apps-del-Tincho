
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
}

export interface Transaction {
  id:string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  categoryId: string;
  type: TransactionType;
  isHabitual: boolean;
  currency?: 'ARS' | 'USD';
  goalId?: string;
}