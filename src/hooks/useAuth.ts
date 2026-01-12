import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, logout } from '../reducers/authSlice';
import { signIn } from '../api/Auth';
import type { AppDispatch } from '../store/index';
import type { AuthUser } from '../types/auth.types';

interface SignInParams {
  email: string;
  password: string;
  isSignup?: boolean;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | undefined;
  loading: boolean;
  error: string | null;
  signIn: (params: SignInParams) => Promise<AuthUser>;
  signOut: () => void;
}

const performSignIn = async (
  email: string,
  password: string,
  isSignup: boolean,
  dispatch: AppDispatch
): Promise<AuthUser> => {
  const apiPath = isSignup ? '/signup' : '/signin';
  const result = await signIn(email, password, apiPath);
  const token = result?.data?.token;
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(result.data));
    dispatch(login(result.data));
  }
  return result.data;
};

const performSignOut = (dispatch: AppDispatch): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  dispatch(logout());
};

const useAuthCallbacks = (dispatch: AppDispatch, setLoading: (v: boolean) => void, setError: (v: string | null) => void): { handleSignIn: (params: SignInParams) => Promise<AuthUser>; handleSignOut: () => void } => {
  const handleSignIn = useCallback(
    async ({ email, password, isSignup }: SignInParams): Promise<AuthUser> => {
      setLoading(true);
      setError(null);
      try {
        return await performSignIn(email, password, isSignup ?? false, dispatch);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Authentication failed';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setLoading, setError]
  );

  const handleSignOut = useCallback((): void => {
    performSignOut(dispatch);
  }, [dispatch]);

  return { handleSignIn, handleSignOut };
};

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = user?.token || localStorage.getItem('authToken') || undefined;
  const { handleSignIn, handleSignOut } = useAuthCallbacks(dispatch, setLoading, setError);

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
