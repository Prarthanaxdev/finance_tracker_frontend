import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";
import "../Charts/ChartSetup";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  CategoryBreakdownItem,
} from "../../api/getCategoryBreakdown";
import { CHART_COLORS, CHART_BORDER_COLORS } from "../../utils/common";

interface CategoryExpense {
  name: string;
  amount: number;
}

const ExpenseBreakdown = () => {
  const { categoryBreakdown } = useLoaderData() as {
    categoryBreakdown: { data: CategoryBreakdownItem[] };
  };
  const revalidator = useRevalidator();
  const refreshVersion = useSelector((state: any) => state.refreshVersion.refreshVersion);
  const prevRefreshVersionRef = useRef(refreshVersion);

  // Revalidate loader data when refreshVersion changes
  useEffect(() => {
    if (refreshVersion !== prevRefreshVersionRef.current) {
      prevRefreshVersionRef.current = refreshVersion;
      revalidator.revalidate();
    }
  }, [refreshVersion, revalidator]);

  const breakdown = categoryBreakdown?.data ?? [];

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
