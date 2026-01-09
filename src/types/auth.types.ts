export interface AuthUser {
  token?: string;
  _id?: string;
  name?: string;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
  message?: string;
}
