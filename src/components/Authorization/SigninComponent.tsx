import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

const SigninComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 70,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          <SavingsOutlinedIcon fontSize="large" sx={{ mr: 1 }} />
          FinanceFlow
        </Typography>
      </Box>

      <Box
        sx={{
          width: 500,
          p: 4,
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 1 }}>
          Welcome Back
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, display: 'block', color: 'text.secondary' }}
        >
          Sign in to access your finance dashboard
        </Typography>

        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 14px 30px rgba(18,196,139,0.18)',
              fontWeight: 500,
              fontSize: '18px',
            }}
          >
            Sign In
          </Button>

          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 2,
              color: 'text.secondary',
              cursor: 'pointer',
              transition: 'color 150ms',
              '&:hover': { color: 'text.primary' },
            }}
          >
            Don't have an account? Sign up
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SigninComponent;
