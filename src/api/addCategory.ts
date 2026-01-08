import { BASE_URL } from "../utils/common";

interface addCategoryResponse {
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

interface AddCategoryResult {
  success: boolean;
  message?: string;
}

export const addCategory = async (token: string, category: addCategoryResponse): Promise<AddCategoryResult> => {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to add category');
  }
  return res.json();
};
