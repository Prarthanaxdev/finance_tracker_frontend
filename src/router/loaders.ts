import { LoaderFunction, ActionFunction, redirect } from 'react-router-dom';
import { signIn, handleSignin } from '../api/Auth';
import { getDashboardSummary } from '../api/dashboardSummary';
import { getMonthlyTrend } from '../api/getMonthlyTrend';
import { getCategoryBreakdown } from '../api/getCategoryBreakdown';
import { addTransaction } from '../api/addTransaction';
import { deleteTransaction } from '../api/deleteTransaction';
import { updateTransaction } from '../api/updateTransaction';

export interface AuthActionData {
  error?: string;
  success?: boolean;
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
      categoryBreakdown
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

// Transaction action - handles adding, updating, and deleting transactions
export const transactionAction: ActionFunction = async ({ request }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return { error: 'Authentication required' };
  }

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    switch (intent) {
      case 'add': {
        const transactionData = {
          categoryId: formData.get('categoryId') as string,
          amount: Number(formData.get('amount')),
          description: formData.get('description') as string || undefined,
          type: formData.get('type') as 'income' | 'expense'
        };
        await addTransaction(token, transactionData);
        return { success: true, message: 'Transaction added successfully' };
      }

      case 'update': {
        const transactionData = {
          _id: formData.get('id') as string,
          categoryId: formData.get('categoryId') as string,
          amount: Number(formData.get('amount')),
          description: formData.get('description') as string || undefined,
          type: formData.get('type') as 'income' | 'expense'
        };
        await updateTransaction(token, transactionData);
        return { success: true, message: 'Transaction updated successfully' };
      }

      case 'delete': {
        const transactionData = {
          id: formData.get('id') as string
        };
        await deleteTransaction(token, transactionData);
        return { success: true, message: 'Transaction deleted successfully' };
      }

      default:
        return { error: 'Invalid transaction action' };
    }
  } catch (error: any) {
    return { error: error.message || 'Transaction operation failed' };
  }
};
