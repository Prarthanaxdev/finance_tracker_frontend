import { apiClient } from '../utils/apiClientService';

export interface TransactionApiItem {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId?: string;
  description?: string;
  createdAt?: string;
}

export interface GetTransactionsResult {
  message?: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    transactions: TransactionApiItem[];
  };
}

export const getTransactions = async (
  token: string,
  limit: number,
  offset: number,
  type?: 'income' | 'expense'
): Promise<GetTransactionsResult | TransactionApiItem[]> => {
  const params: Record<string, string | number> = {
    limit,
    offset,
  };
  if (type) params.type = type;

  return apiClient.get<GetTransactionsResult | TransactionApiItem[]>(
    '/api/transactions',
    token,
    params
  );
};
