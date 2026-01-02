import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { handleSignin } from './api/Auth';
import { useNavigate } from 'react-router-dom';

const SigninComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showSignupForm, setShowSignupForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const apiPath = showSignupForm ? '/signup' : '/signin';
      const result = await handleSignin({ e, email, password, apiPath });
      setError(null);
      const token = result?.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
        navigate('/dashboard');
      }
      console.log('Signed in', result);
    } catch (err: any) {
      const msg = err?.message || 'Signin failed';
      setError(msg);
      console.error('Signin error', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" className="logo" sx={{ fontWeight: 700, color: 'text.primary' }}>
          <SavingsOutlinedIcon fontSize="large" />
          FinanceFlow
        </Typography>
      </Box>

      <Box
        sx={{
          width: 500,
          p: 4,
          pt: 6,
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 1 }}>
          {showSignupForm ? 'Create Account' : 'Welcome Back'}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, display: 'block', color: 'text.secondary' }}
        >
          {showSignupForm
            ? 'Start tracking your finances today'
            : 'Sign in to access your finance dashboard'}
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
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!email.trim() || !password}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 14px 30px rgba(18,196,139,0.18)',
              fontWeight: 500,
              fontSize: '18px',
            }}
            onClick={handleAuth}
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
            onClick={() => setShowSignupForm((prev) => !prev)}
          >
            {showSignupForm ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SigninComponent;
