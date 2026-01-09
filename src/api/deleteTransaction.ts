import { apiClient } from '../utils/apiClientService';

interface TransactionData {
  id: string;
}

export const deleteTransaction = async (token: string, data: TransactionData): Promise<void> => {
  await apiClient.delete(`/api/transactions/${data.id}`, token);
};
