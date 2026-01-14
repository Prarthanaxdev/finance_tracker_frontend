import { LoaderFunction, ActionFunction, redirect } from 'react-router-dom';
import { handleSignin } from '../api/Auth';
import { getDashboardSummary } from '../api/dashboardSummary';
import { getMonthlyTrend } from '../api/getMonthlyTrend';
import { getCategoryBreakdown } from '../api/getCategoryBreakdown';
export interface AuthActionData {
  success?: boolean;
  error?: string;
}

// Dashboard loader - fetches all dashboard data
export const dashboardLoader: LoaderFunction = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return redirect('/');
  }

  try {
    // Fetch dashboard data sequentially
    const currentYear = new Date().getFullYear();
    const summary = await getDashboardSummary(token);
    const monthlyTrends = await getMonthlyTrend(token, currentYear);
    const categoryBreakdown = await getCategoryBreakdown(token);

    return {
      summary,
      monthlyTrends,
      categoryBreakdown,
    };
  } catch (error) {
    // If any API fails, redirect to login
    localStorage.removeItem('token');
    return redirect('/');
  }
};

// Auth action - handles both login and register
export const authAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    let result;
    if (intent === 'login') {
      result = await handleSignin({ email, password, apiPath: '/signin' });
    } else if (intent === 'register') {
      result = await handleSignin({ email, password, apiPath: '/signup' });
    } else {
      return { error: 'Invalid action' };
    }

    // Store token and redirect to dashboard
    localStorage.setItem('authToken', result.data.token);
    return redirect('/dashboard');
  } catch (error: any) {
    return { error: error.message || 'Authentication failed' };
  }
};
