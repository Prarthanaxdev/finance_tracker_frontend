import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, logout } from '../reducers/authSlice';
import { signIn } from '../api/Auth';

interface SignInParams {
  email: string;
  password: string;
  isSignup?: boolean; // if true, hits /signup; else /signin
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = user?.token || localStorage.getItem('authToken') || undefined;

  const signInAction = useCallback(
    async ({ email, password, isSignup }: SignInParams) => {
      setLoading(true);
      setError(null);
      try {
        const apiPath = isSignup ? '/signup' : '/signin';
        const result = await signIn(email, password, apiPath);
        const token = result?.data?.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('authUser', JSON.stringify(result.data));
          dispatch(login(result.data));
        }
        return result.data;
      } catch (e: any) {
        const msg = e?.message || 'Authentication failed';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const signOutAction = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    signIn: signInAction,
    signOut: signOutAction,
  };
}
