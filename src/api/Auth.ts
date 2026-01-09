import type { FormEvent } from 'react';
import { apiClient } from '../utils/apiClientService';

export interface LoginResult {
  token: string;
  [key: string]: any;
}

export async function signIn(
  email: string,
  password: string,
  apiPath: string
): Promise<LoginResult> {
  try {
    return await apiClient.post<LoginResult>(`/api${apiPath}`, { email, password });
  } catch (error: any) {
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('Invalid email or password');
    }
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
