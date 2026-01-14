import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AuthComponent from '../AuthComponent';
import authSlice from '../../../reducers/authSlice';

// Create test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      refreshVersion: (state = { refreshVersion: 0 }) => state,
    },
  });
};

// Test wrapper with router and store
const renderAuthComponent = () => {
  const store = createTestStore();
  const router = createMemoryRouter([
    {
      path: '/',
      element: <AuthComponent />,
      action: async () => null,
    },
  ]);

  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
};

describe('AuthComponent', () => {
  describe('Form Rendering', () => {
    it('renders login form by default', () => {
      renderAuthComponent();

      expect(screen.getAllByText('Welcome Back')[0]).toBeInTheDocument();
      expect(screen.getAllByLabelText(/email/i)[0]).toBeInTheDocument();
      expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /sign in/i })[0]).toBeInTheDocument();
    });

    it('can toggle to signup form', () => {
      renderAuthComponent();

      const toggleButton = screen.getAllByText("Don't have an account? Sign up")[0];
      fireEvent.click(toggleButton);

      expect(screen.getAllByText('Create Account')[0]).toBeInTheDocument();
      expect(screen.getAllByLabelText(/confirm password/i)[0]).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /sign up/i })[0]).toBeInTheDocument();
    });
  });

  describe('Email Validation', () => {
    it('accepts valid email format', () => {
      renderAuthComponent();
      const emailInput = screen.getAllByLabelText(/email/i)[0];

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('accepts different email formats', () => {
      renderAuthComponent();
      const emailInput = screen.getAllByLabelText(/email/i)[0];

      fireEvent.change(emailInput, { target: { value: 'user.name+tag@domain.co.uk' } });

      expect(emailInput).toHaveValue('user.name+tag@domain.co.uk');
    });
  });

  describe('Password Input', () => {
    it('accepts password input', () => {
      renderAuthComponent();
      const passwordInput = screen.getAllByLabelText(/^password$/i)[0];

      fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });

      expect(passwordInput).toHaveValue('TestPassword123!');
    });

    it('shows confirm password field in signup mode', () => {
      renderAuthComponent();

      // Switch to signup mode (use first toggle button)
      const toggleButtons = screen.getAllByText("Don't have an account? Sign up");
      fireEvent.click(toggleButtons[0]);

      const confirmPasswordInput = screen.getAllByLabelText(/confirm password/i)[0];
      expect(confirmPasswordInput).toBeInTheDocument();

      fireEvent.change(confirmPasswordInput, { target: { value: 'TestPassword123!' } });
      expect(confirmPasswordInput).toHaveValue('TestPassword123!');
    });
  });
});
