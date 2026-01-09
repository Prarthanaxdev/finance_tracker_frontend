import { apiClient } from "../utils/apiClientService";

export interface CategoryBreakdownItem {
  _id?: string;
  total: number;
  category: string;
  percentage?: number;
}

export interface GetCategoryBreakdownResult {
  success?: boolean;
  message?: string;
  data: CategoryBreakdownItem[];
}

export const getCategoryBreakdown = async (
  token: string,
): Promise<GetCategoryBreakdownResult> => {
  return apiClient.get<GetCategoryBreakdownResult>(
    "/api/dashboard/category-breakdown",
    token,
  );
};
