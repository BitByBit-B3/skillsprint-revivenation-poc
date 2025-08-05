'use client';

import { useState } from 'react';
import { loginWithPhone, verifyOtp } from '@/lib/api';
import { AuthClaims } from '@/lib/types';
import { StatusChip } from '@/components/StatusChip';

interface AuthClaimsProps {
  onAuthSuccess: (claims: AuthClaims, sessionId: string) => void;
  user?: AuthClaims | null;
}

export function AuthClaimsSection({ onAuthSuccess, user }: AuthClaimsProps) {
  const [phone, setPhone] = useState('+94');
  const [otp, setOtp] = useState('');
  const [txnId, setTxnId] = useState('');
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState<'idle' | 'otp-sent' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await loginWithPhone(phone);
      setTxnId(response.txnId);
      setRequestId(response.requestId);
      setStatus('otp-sent');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setStatus('error');
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await verifyOtp(txnId, otp, requestId);
      // For MOSIP compliance, we need to get claims separately
      // The sessionId is the txnId in our implementation
      const mockClaims: AuthClaims = {
        sub: 'did:national:abc123',
        name: 'Demo User',
        email: 'demo@user.lk',
        phone: phone,
        nationalId: 'LK123456789'
      };
      onAuthSuccess(mockClaims, txnId);
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      setStatus('error');
    }
  };

  if (user) {
    return (
      <div className="card">
        <h2 className="text-lg font-medium text-foreground mb-4">Government Sign-In</h2>
        <StatusChip status="success" data-test="auth-status" />
        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="text-foreground-secondary">Name: </span>
            <span className="text-foreground">{user.name}</span>
          </div>
          <div>
            <span className="text-foreground-secondary">Email: </span>
            <span className="text-foreground">{user.email}</span>
          </div>
          <div>
            <span className="text-foreground-secondary">ID: </span>
            <span className="text-foreground font-mono">{user.sub}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-foreground mb-4">Government Sign-In</h2>
      
      <StatusChip 
        status={status === 'loading' ? 'loading' : status === 'error' ? 'error' : 'idle'} 
        data-test="auth-status" 
      />

      <div className="mt-4 space-y-4">
        {status === 'idle' && (
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Phone number (e.g., +94771234567)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input w-full"
            />
            <button
              onClick={handleLogin}
              data-test="btn-signin"
              className="btn-primary w-full"
            >
              Sign in with Government ID
            </button>
          </div>
        )}

        {status === 'otp-sent' && (
          <div className="space-y-3">
            <div className="text-sm text-accent-emerald bg-accent-emerald/10 p-3 rounded-xl">
              OTP sent to {phone}. Enter any 6-digit code (demo mode).
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input w-full"
              maxLength={6}
            />
            <button
              onClick={handleVerify}
              className="btn-primary w-full"
              disabled={otp.length !== 6}
            >
              Verify OTP
            </button>
          </div>
        )}

        {error && (
          <div className="text-sm text-error bg-error/10 p-3 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}