export interface Category {
  _id: string;
  id?: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
}
