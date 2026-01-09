import { apiClient } from '../utils/apiClientService';

interface addCategoryResponse {
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

interface AddCategoryResult {
  success: boolean;
  message?: string;
}

export const addCategory = async (
  token: string,
  category: addCategoryResponse
): Promise<AddCategoryResult> => {
  return apiClient.post<AddCategoryResult>('/api/categories', category, token);
};
