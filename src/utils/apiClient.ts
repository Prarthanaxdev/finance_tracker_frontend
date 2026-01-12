import { config } from '../config/env';

const API_TIMEOUT = config.apiTimeout;

export async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  // Step1: Create an AbortController to handle timeout
  const controller = new AbortController();

  // Step 2: Set a timeout to abort the request
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    // Step 3: Make the fetch request with the AbortController's signal
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}
