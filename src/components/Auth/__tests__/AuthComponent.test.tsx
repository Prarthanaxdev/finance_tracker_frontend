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
    </Provider>
  );
};

describe('AuthComponent', () => {
  describe('Form Rendering', () => {
    it('renders login form by default', () => {
      renderAuthComponent();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('can toggle to signup form', () => {
      renderAuthComponent();

      const toggleButton = screen.getByText("Don't have an account? Sign up");
      fireEvent.click(toggleButton);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('Email Validation', () => {
    it('accepts valid email format', () => {
      renderAuthComponent();
      const emailInput = screen.getByLabelText(/email/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('accepts different email formats', () => {
      renderAuthComponent();
      const emailInput = screen.getByLabelText(/email/i);
      
      fireEvent.change(emailInput, { target: { value: 'user.name+tag@domain.co.uk' } });
      
      expect(emailInput).toHaveValue('user.name+tag@domain.co.uk');
    });
  });

  describe('Password Input', () => {
    it('accepts password input', () => {
      renderAuthComponent();
      const passwordInput = screen.getByLabelText(/^password$/i);
      
      fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
      
      expect(passwordInput).toHaveValue('TestPassword123!');
    });

    it('shows confirm password field in signup mode', () => {
      renderAuthComponent();

      // Switch to signup mode
      const toggleButton = screen.getByText("Don't have an account? Sign up");
      fireEvent.click(toggleButton);

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toBeInTheDocument();
      
      fireEvent.change(confirmPasswordInput, { target: { value: 'TestPassword123!' } });
      expect(confirmPasswordInput).toHaveValue('TestPassword123!');
    });
  });

  describe('Button States', () => {
    it('shows correct button text based on mode', () => {
      renderAuthComponent();

      // Login mode
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

      // Switch to signup mode
      const toggleButton = screen.getByText("Don't have an account? Sign up");
      fireEvent.click(toggleButton);

      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });
});
