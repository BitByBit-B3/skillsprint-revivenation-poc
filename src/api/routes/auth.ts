import { Request, Response } from 'express';
import { ValidationError } from '../../lib/errors';
import { logger } from '../../lib/logger';

interface AuthClaims {
  sub: string;
  name?: string;
  email?: string;
}

// In-memory stores for mock implementation
const otpSessions = new Map<string, { phone: string; createdAt: number }>();
const userSessions = new Map<string, AuthClaims>();

export function login(req: Request, res: Response): void {
  const { phone } = req.body;
  
  if (!phone || typeof phone !== 'string') {
    throw new ValidationError('Phone number is required');
  }
  
  const txnId = `tx_${Date.now()}`;
  otpSessions.set(txnId, {
    phone,
    createdAt: Date.now()
  });
  
  logger.info(`OTP login initiated for ${phone}`);
  
  res.status(200).json({
    txnId,
    channel: 'otp',
    message: 'OTP sent'
  });
}

export function verify(req: Request, res: Response): void {
  const { txnId, otp } = req.body;
  
  if (!txnId || !otp) {
    throw new ValidationError('Transaction ID and OTP are required');
  }
  
  const session = otpSessions.get(txnId);
  if (!session) {
    throw new ValidationError('Invalid transaction ID');
  }
  
  // Accept any 6-digit OTP in mock mode
  if (!/^\d{6}$/.test(otp)) {
    throw new ValidationError('Invalid OTP format');
  }
  
  // Create claims
  const claims: AuthClaims = {
    sub: 'did:national:abc123',
    name: 'Demo User',
    email: 'demo@user.lk'
  };
  
  // Store in session (using txnId as session key for simplicity)
  userSessions.set(txnId, claims);
  
  // Clean up OTP session
  otpSessions.delete(txnId);
  
  logger.info(`User authenticated: ${claims.sub}`);
  
  res.status(200).json({
    idToken: 'mock.jwt.token',
    claims,
    sessionId: txnId
  });
}

export function getClaims(req: Request, res: Response): void {
  const sessionId = req.headers['x-session-id'] as string;
  
  if (!sessionId) {
    res.status(200).json(null);
    return;
  }
  
  const claims = userSessions.get(sessionId);
  res.status(200).json(claims || null);
}