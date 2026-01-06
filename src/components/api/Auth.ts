import type { FormEvent } from 'react';
import { BASE_URL } from '../utils/common';
import { fetchWithTimeout } from '../utils/apiClient';

export interface LoginResult {
  token: string;
  [key: string]: any;
}

export async function signIn(
  email: string,
  password: string,
  apiPath: string,
): Promise<LoginResult> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api${apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid email or password');
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errBody?.message || 'Login failed');
    }

    return (await res.json()) as LoginResult;
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error('Network error. Check your connection.');
    }
    throw error;
  }
}

export async function handleSignin(params: {
  email: string;
  password: string;
  e?: FormEvent;
  apiPath: string;
}): Promise<LoginResult> {
  params.e?.preventDefault();
  return signIn(params.email, params.password, params.apiPath);
}
