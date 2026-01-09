import { apiClient } from '../utils/apiClientService';

interface TransactionData {
  _id: string;
  categoryId: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
  userId?: string;
  isDeleted?: boolean;
}

export const updateTransaction = async (token: string, data: TransactionData): Promise<void> => {
  if (!data._id) {
    throw new Error('Transaction id (_id) is required');
  }

  await apiClient.put(`/api/transactions/${data._id}`, data, token);
};
