import { BASE_URL } from '../utils/common';

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
  type?: 'income' | 'expense',
): Promise<GetTransactionsResult | TransactionApiItem[]> => {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  if (type) params.append('type', type);

  const res = await fetch(`${BASE_URL}/api/transactions?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to fetch transactions');
  }

  return res.json();
};
