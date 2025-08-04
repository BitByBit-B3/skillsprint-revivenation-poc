import { env } from './env';
import { AuthClaims, EducationRecord, Gig, PayoutResponse, PayoutStatus } from './types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${env.API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || 'Request failed');
  }
  
  return response.json();
}

export async function loginWithPhone(phone: string): Promise<{ txnId: string; channel: string; message: string }> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(txnId: string, otp: string): Promise<{ idToken: string; claims: AuthClaims; sessionId: string }> {
  return apiRequest('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ txnId, otp }),
  });
}

export async function getClaims(sessionId?: string): Promise<AuthClaims | null> {
  return apiRequest('/api/auth/claims', {
    headers: sessionId ? { 'x-session-id': sessionId } : {},
  });
}

export async function fetchEducation(subject: string): Promise<EducationRecord> {
  return apiRequest('/api/nde/education', {
    method: 'POST',
    body: JSON.stringify({ subject }),
  });
}

export async function listGigs(): Promise<{ gigs: Gig[] }> {
  return apiRequest('/v1/gigs');
}

export async function initiatePayout(gigId: string, amountLKR: number): Promise<PayoutResponse> {
  return apiRequest('/api/paydpi', {
    method: 'POST',
    body: JSON.stringify({ gigId, amountLKR }),
  });
}

export async function getPayoutStatus(payoutId: string): Promise<PayoutStatus> {
  // Add cache busting parameter to prevent 304 responses
  const cacheBuster = Date.now();
  return apiRequest(`/api/paydpi/status?payoutId=${encodeURIComponent(payoutId)}&_t=${cacheBuster}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
}