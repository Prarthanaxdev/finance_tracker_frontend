import { Suspense, lazy } from 'react';
import { Container } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import HeaderComponent from './Header';
import './Dashboard.scss';
const TabComponent = lazy(() => import('./Tabs/TabComponent'));
const ChartLayout = lazy(() => import('../Charts/ChartLayout'));
const SummaryCards = lazy(() => import('./SummaryCards'));

const DashboardComponent = () => {
  const { summary, monthlyTrends, categoryBreakdown } = useLoaderData() as {
    summary: { data: { income: number; expense: number } };
    monthlyTrends: any;
    categoryBreakdown: any;
  };

  console.log('Dashboard data:', { summary, monthlyTrends, categoryBreakdown });

  if (!summary || !summary.data) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <h1>Dashboard</h1>
        <div>Loading dashboard data...</div>
      </Container>
    );
  }

  return (
    <>
      <HeaderComponent />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <h1>Dashboard</h1>
        <Suspense fallback={<div>Loading dashboard widgets...</div>}>
          <SummaryCards income={summary.data.income} expense={summary.data.expense} />
          <ChartLayout />
          <TabComponent />
        </Suspense>
      </Container>
    </>
  );
};

export default DashboardComponent;
