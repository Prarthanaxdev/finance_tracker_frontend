import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import '../Charts/ChartSetup';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMonthlyTrend, MonthlyTrendItem } from '../../api/getMonthlyTrend';
import { getAuthToken } from '../../utils/common';

const MonthlySummary = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshVersion = useSelector((state: any) => state.refreshVersion.refreshVersion);

  useEffect(() => {
    const loadData = async () => {
      const token = getAuthToken();
      if (!token) return;

      setLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const res = await getMonthlyTrend(token, currentYear);
        setMonthlyData(res?.data ?? []);
      } catch (err) {
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshVersion]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
        }}
      >
        <span style={{ color: '#999' }}>Loading...</span>
      </Box>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
        }}
      >
        <span style={{ color: '#999' }}>No data available</span>
      </Box>
    );
  }

  // Extract labels (months)
  const labels = monthlyData.map((item) => item.month);

  // Extract income and expense data
  const incomeData = monthlyData.map((item) => item.income);
  const expenseData = monthlyData.map((item) => item.expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
        categoryPercentage: 0.95,
        barPercentage: 0.95,
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default MonthlySummary;
