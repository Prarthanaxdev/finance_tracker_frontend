import apiClient from '../utils/apiClientService';

interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: {
    income: number;
    expense: number;
    balance: number;
  };
}

export const getDashboardSummary = async (
  token: string
): Promise<DashboardSummaryResponse> => {
  return apiClient.get<DashboardSummaryResponse>(
    '/api/dashboard/summary',
    token
  );
};
