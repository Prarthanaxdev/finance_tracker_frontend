import apiClient from "../utils/apiClientService";

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expense: number;
}

export interface GetMonthlyTrendResult {
  success?: boolean;
  message?: string;
  data: MonthlyTrendItem[];
}

export const getMonthlyTrend = async (
  token: string,
  year?: number,
): Promise<GetMonthlyTrendResult> => {
  const params = year ? { year } : undefined;
  return apiClient.get<GetMonthlyTrendResult>(
    "/api/dashboard/monthly-trend",
    token,
    params,
  );
}
