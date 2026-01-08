import { BASE_URL } from '../utils/common';

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

interface GetCategoryResult {
  success: boolean;
  message?: string;
  data: Category[];
  total: number;
  limit: number;
  offset: number;
}

export const getCategory = async (token: string, limit: number, offset: number): Promise<GetCategoryResult> => {
  const res = await fetch(`${BASE_URL}/api/categories?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,

    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to fetch categories');
  }

  return res.json();
};
