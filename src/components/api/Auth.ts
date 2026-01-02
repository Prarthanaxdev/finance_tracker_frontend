import type { FormEvent } from 'react';
import { BASE_URL } from '../utils/common';

export interface LoginResult {
  token: string;
  [key: string]: any;
}

export async function signIn(
  email: string,
  password: string,
  apiPath: string,
): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/api${apiPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errBody: any;
    try {
      errBody = await res.json();
    } catch {
      errBody = await res.text();
    }
    throw new Error(errBody?.message || res.statusText || 'Login failed');
  }

  return (await res.json()) as LoginResult;
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
