import { Category, TransactionType } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'cat-inc-1', name: 'Salario', type: TransactionType.INCOME },
  { id: 'cat-inc-2', name: 'Bonos', type: TransactionType.INCOME },
  { id: 'cat-inc-3', name: 'Inversiones', type: TransactionType.INCOME },
  { id: 'cat-inc-4', name: 'Otro Ingreso', type: TransactionType.INCOME },
  // Expense
  { id: 'cat-exp-1', name: 'Impuestos y Servicios', type: TransactionType.EXPENSE },
  { id: 'cat-exp-2', name: 'Tarjetas', type: TransactionType.EXPENSE },
  { id: 'cat-exp-3', name: 'Educación', type: TransactionType.EXPENSE },
  { id: 'cat-exp-4', name: 'Mesadas', type: TransactionType.EXPENSE },
  { id: 'cat-exp-5', name: 'Salud', type: TransactionType.EXPENSE },
  { id: 'cat-exp-6', name: 'Alimentacion', type: TransactionType.EXPENSE },
  { id: 'cat-exp-7', name: 'Otros', type: TransactionType.EXPENSE },
  // Savings
  { id: 'cat-sav-1', name: 'Plazo Fijo', type: TransactionType.SAVING },
  { id: 'cat-sav-2', name: 'Compra Dólares', type: TransactionType.SAVING },
  { id: 'cat-sav-3', name: 'Otras Inversiones', type: TransactionType.SAVING },
  { id: 'cat-sav-4', name: 'Otro Ahorro', type: TransactionType.SAVING },
];

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
