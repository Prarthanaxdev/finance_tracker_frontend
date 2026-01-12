import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";
import "../Charts/ChartSetup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CategoryBreakdownItem,
  getCategoryBreakdown,
} from "../../api/getCategoryBreakdown";
import { getAuthToken, CHART_COLORS, CHART_BORDER_COLORS } from "../../utils/common";

interface CategoryExpense {
  name: string;
  amount: number;
}

const ExpenseBreakdown = () => {
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([]);
  const refreshVersion = useSelector((state: any) => state.refreshVersion.refreshVersion);

  useEffect(() => {
    const loadData = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await getCategoryBreakdown(token);
        setBreakdown(res?.data ?? []);
      } catch (err) {
        setBreakdown([]);
      }
    };
    loadData();
  }, [refreshVersion]); // Re-fetch data when refreshVersion changes

  if (breakdown.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <span style={{ color: "#999" }}>No expense data available</span>
      </Box>
    );
  }

  // Converting response to chart data format
  const categoryData: CategoryExpense[] = breakdown.map((item) => ({
    name: item.category,
    amount: item.total,
  }));

  const labels = categoryData.map((item) => item.name);
  const data = categoryData.map((item) => item.amount);

  const colors = CHART_COLORS;
  const borderColors = CHART_BORDER_COLORS;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses by Category",
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
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
        position: "bottom" as const,
        labels: {
          color: "#fff",
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
  };

  return (
    <Box sx={{ height: 300 }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default ExpenseBreakdown;
