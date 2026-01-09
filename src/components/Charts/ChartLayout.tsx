import { Box, Paper, Typography } from "@mui/material";
import ExpenseBreakdown from "./ExpenseBreakdown";
import { useCallback } from "react";

interface ChartLayoutProps {
  onTransactionSaved?: () => void;
}

const ChartLayout = ({ onTransactionSaved }: ChartLayoutProps) => {
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
        {/* Chart will go here */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          */ Will do on monday */
        </Box>
      </Paper>
    </Box>
  );
};

export default ChartLayout;
