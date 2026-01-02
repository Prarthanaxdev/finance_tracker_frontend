import React from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

const DashboardComponent = () => {
  console.log('DashboardComponent loaded');
  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper', height: '85px' }}>
      <Typography variant="h5" className="logo">
        <SavingsOutlinedIcon fontSize="large" />
        FinanceFlow
      </Typography>
    </Box>
  );
};

export default DashboardComponent;
