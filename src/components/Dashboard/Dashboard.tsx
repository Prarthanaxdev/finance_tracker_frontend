import { useState, useEffect, Suspense, lazy } from 'react';
import { Container } from '@mui/material';
import HeaderComponent from './Header';
import './Dashboard.css';
const TabComponent = lazy(() => import('./Tabs/TabComponent'));
const ChartLayout = lazy(() => import('../Charts/ChartLayout'));
const SummaryCards = lazy(() => import('./SummaryCards'));
import { getDashboardSummary } from '../../api/dashboardSummary';
import { getAuthToken } from '../../utils/common';
import { useAppSelector } from '../../store/hooks';

const DashboardComponent = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const refreshVersion = useAppSelector((state) => state.refreshVersion.refreshVersion);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const result = await getDashboardSummary(token);
        setIncomeTotal(result.data.income);
        setExpenseTotal(result.data.expense);
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      }
    };

    fetchSummary();
  }, [refreshVersion]);

  return (
    <>
      <HeaderComponent />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <h1>Dashboard</h1>
        <Suspense fallback={<div>Loading dashboard widgets...</div>}>
          <SummaryCards income={incomeTotal} expense={expenseTotal} />
          <ChartLayout />
          <TabComponent />
        </Suspense>
      </Container>
    </>
  );
};

export default DashboardComponent;
