import { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useRevalidator } from "react-router-dom";
import { useSelector } from "react-redux";
import ExpenseBreakdown from "./ExpenseBreakdown";
import MonthlySummary from "./MonthlySummary";

const ChartLayout = () => {
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

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
        mb: 3,
      }}
    >
      {/* Expense Breakdown */}
      <Paper
        sx={{
          p: 3,
          backgroundColor: "#1a2332",
          borderRadius: 2,
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
          Expense Breakdown
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          <ExpenseBreakdown />
        </Box>
      </Paper>

      {/* Monthly Overview Box */}
      <Paper
        sx={{
          p: 3,
          backgroundColor: "#1a2332",
          borderRadius: 2,
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
          Monthly Overview
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          <MonthlySummary />
        </Box>
      </Paper>
    </Box>
  );
};

export default ChartLayout;
