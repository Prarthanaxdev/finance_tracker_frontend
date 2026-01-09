import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import HeaderComponent from './Header';
import './Dashboard.css';
import TabComponent from './Tabs/TabComponent';
import ChartLayout from '../Charts/ChartLayout';
import { getTransactions } from '../../api/getTransactions';
import { getAuthToken } from '../../utils/common';

const DashboardComponent = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        // Fetch income transactions
        const incomeResult = await getTransactions(token, 1000, 0, 'income');
        const incomeData = Array.isArray(incomeResult)
          ? incomeResult
          : incomeResult?.data?.transactions || [];
        const incomeSum = incomeData.reduce((sum, t) => sum + (t.amount || 0), 0);
        setIncomeTotal(incomeSum);

        // Fetch expense transactions
        const expenseResult = await getTransactions(token, 1000, 0, 'expense');
        const expenseData = Array.isArray(expenseResult)
          ? expenseResult
          : expenseResult?.data?.transactions || [];
        const expenseSum = expenseData.reduce((sum, t) => sum + (t.amount || 0), 0);
        setExpenseTotal(expenseSum);
      } catch (error) {
        console.error('Failed to fetch transaction totals:', error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <>
      <HeaderComponent />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ChartLayout />
        <TabComponent />
      </Container>
    </>
  );
};

export default DashboardComponent;
