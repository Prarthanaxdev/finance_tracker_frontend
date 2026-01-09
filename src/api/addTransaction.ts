import { apiClient } from '../utils/apiClientService';

interface TransactionData {
  categoryId: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
}

export const addTransaction = async (token: string, data: TransactionData): Promise<void> => {
  await apiClient.post('/api/transactions', data, token);
};
