import { Category } from './category.types';

export interface Transaction {
  _id: string;
  id?: string;
  userId: string;
  categoryId: Category | string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRow {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
}

export interface TransactionFormData {
  amount: string;
  description: string;
  categoryId: string;
}
