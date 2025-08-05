import { Request, Response } from 'express';
import { ValidationError } from '../../lib/errors';
import { logger } from '../../lib/logger';

interface AuthClaims {
  sub: string;
  name?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
}

// In-memory stores for mock implementation
const otpSessions = new Map<string, { phone: string; createdAt: number; requestId: string }>();
const userSessions = new Map<string, AuthClaims>();

/**
 * MOSIP Authentication Service - Initiate OTP
 * Compliant with MOSIP 1.2.0 specification
 * https://mosip.github.io/documentation/1.2.0/authentication-service.html
 */
export function login(req: Request, res: Response): void {
  const { phone, requestId } = req.body;
  
  if (!phone || typeof phone !== 'string') {
    throw new ValidationError('Phone number is required');
  }
  
  if (!requestId || typeof requestId !== 'string') {
    throw new ValidationError('Request ID is required');
  }
  
  // Generate transaction ID as per MOSIP spec
  const txnId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  otpSessions.set(txnId, {
    phone,
    createdAt: Date.now(),
    requestId
  });
  
  logger.info(`MOSIP OTP login initiated for ${phone}, requestId: ${requestId}`);
  
  // MOSIP compliant response format
  res.status(200).json({
    txnId,
    requestId,
    responseTime: new Date().toISOString(),
    response: {
      authStatus: "INITIATED",
      authToken: null,
      message: "OTP sent successfully"
    },
    errors: null
  });
}

/**
 * MOSIP Authentication Service - Verify OTP
 * Compliant with MOSIP 1.2.0 specification
 */
export function verify(req: Request, res: Response): void {
  const { txnId, otp, requestId } = req.body;
  
  if (!txnId || !otp || !requestId) {
    throw new ValidationError('Transaction ID, OTP, and Request ID are required');
  }
  
  const session = otpSessions.get(txnId);
  if (!session) {
    throw new ValidationError('Invalid transaction ID');
  }
  
  if (session.requestId !== requestId) {
    throw new ValidationError('Request ID mismatch');
  }
  
  // Accept any 6-digit OTP in mock mode
  if (!/^\d{6}$/.test(otp)) {
    throw new ValidationError('Invalid OTP format');
  }
  
  // Create MOSIP compliant claims
  const claims: AuthClaims = {
    sub: 'did:national:abc123',
    name: 'Demo User',
    email: 'demo@user.lk',
    phone: session.phone,
    nationalId: 'LK123456789'
  };
  
  // Store in session
  userSessions.set(txnId, claims);
  
  // Clean up OTP session
  otpSessions.delete(txnId);
  
  logger.info(`MOSIP user authenticated: ${claims.sub}`);
  
  // MOSIP compliant response format
  res.status(200).json({
    txnId,
    requestId,
    responseTime: new Date().toISOString(),
    response: {
      authStatus: "SUCCESS",
      authToken: `mock.jwt.token.${txnId}`,
      message: "Authentication successful"
    },
    errors: null
  });
}

/**
 * MOSIP Authentication Service - Get User Claims
 * Compliant with MOSIP 1.2.0 specification
 */
export function getClaims(req: Request, res: Response): void {
  const sessionId = req.headers['x-session-id'] as string;
  
  if (!sessionId) {
    res.status(200).json({
      responseTime: new Date().toISOString(),
      response: null,
      errors: [{
        errorCode: "AUT-001",
        message: "No session found"
      }]
    });
    return;
  }
  
  const claims = userSessions.get(sessionId);
  
  if (!claims) {
    res.status(200).json({
      responseTime: new Date().toISOString(),
      response: null,
      errors: [{
        errorCode: "AUT-002", 
        message: "Invalid session"
      }]
    });
    return;
  }
  
  // MOSIP compliant response format
  res.status(200).json({
    responseTime: new Date().toISOString(),
    response: {
      claims,
      sessionId
    },
    errors: null
  });
}

/**
 * MOSIP Authentication Service - Health Check
 * Compliant with MOSIP 1.2.0 specification
 */
export function health(req: Request, res: Response): void {
  res.status(200).json({
    responseTime: new Date().toISOString(),
    response: {
      status: "UP",
      version: "1.2.0",
      service: "MOSIP Authentication Service"
    },
    errors: null
  });
}