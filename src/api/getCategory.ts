import { apiClient } from "../utils/apiClientService";

interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
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

export const getCategory = async (
  token: string,
  limit: number,
  offset: number,
): Promise<GetCategoryResult> => {
  return apiClient.get<GetCategoryResult>("/api/categories", token, {
    limit,
    offset,
  });
};
