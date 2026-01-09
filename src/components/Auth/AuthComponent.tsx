import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { EMAIL_VALIDATION, PASSWORD_REQUIREMENTS } from "../../utils/common";

const SigninComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showSignupForm, setShowSignupForm] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const { loading, error, signIn } = useAuth();

  // Email validation
  const isValidEmail = (email: string): boolean => {
    return EMAIL_VALIDATION.test(email);
  };

  // Password strength validation
  const getPasswordStrength = (
    password: string,
  ): {
    isValid: boolean;
    message: string;
  } => {
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters",
      };
    }
    if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!PASSWORD_REQUIREMENTS.hasLowercase.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    return { isValid: true, message: "Password is strong" };
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    const passwordStrength = getPasswordStrength(password);
    if (!passwordStrength.isValid) {
      errors.password = passwordStrength.message;
    }

    if (showSignupForm && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await signIn({
        email,
        password,
        isSignup: showSignupForm,
      });
      if (result?.token) navigate("/dashboard");
    } catch (err: any) {
      console.error("Authentication error:", err);
    }
  };

  const toggleSignupForm = () => {
    setShowSignupForm((prev) => !prev);
    setValidationErrors({});
    setConfirmPassword("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          className="logo"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          <SavingsOutlinedIcon fontSize="large" />
          FinanceFlow
        </Typography>
      </Box>

      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: 500 },
          maxWidth: 500,
          p: { xs: 3, md: 4 },
          pt: { xs: 4, md: 6 },
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 8px 30px rgba(2,6,23,0.6)",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 1 }}>
          {showSignupForm ? "Create Account" : "Welcome Back"}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, display: "block", color: "text.secondary" }}
        >
          {showSignupForm
            ? "Start tracking your finances today"
            : "Sign in to access your finance dashboard"}
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setValidationErrors({
                ...validationErrors,
                email: undefined,
              });
            }}
            fullWidth
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setValidationErrors({
                ...validationErrors,
                password: undefined,
              });
            }}
            fullWidth
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            sx={{ mb: 2 }}
          />

          {showSignupForm && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value);
                setValidationErrors({
                  ...validationErrors,
                  confirmPassword: undefined,
                });
              }}
              fullWidth
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              sx={{ mb: 2 }}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              !email.trim() ||
              !password ||
              (showSignupForm && !confirmPassword) ||
              loading
            }
            fullWidth
            sx={{
              py: { xs: 1.2, md: 1.5 },
              borderRadius: 3,
              boxShadow: "0 14px 30px rgba(18,196,139,0.18)",
              fontWeight: 500,
              fontSize: { xs: "16px", md: "18px" },
            }}
            onClick={handleAuth}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 2,
              color: "text.secondary",
              cursor: "pointer",
              transition: "color 150ms",
              "&:hover": { color: "text.primary" },
            }}
            onClick={toggleSignupForm}
          >
            {showSignupForm
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
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
