import { config } from '../config/env';
import { fetchWithTimeout } from './apiClient';

const API_TIMEOUT = config.apiTimeout;

/**
 * Centralized API client for making HTTP requests
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = config.apiBaseUrl, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make an authenticated request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetchWithTimeout(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const errorMessage = text || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    token?: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url = `${endpoint}?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' }, token);
  }

  /**
   * POST request
   */
  async post<T, D = any>(endpoint: string, data: D, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  /**
   * PUT request
   */
  async put<T, D = any>(endpoint: string, data: D, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
