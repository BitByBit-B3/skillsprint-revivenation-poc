import { Request, Response } from 'express';
import { env } from '../../lib/env';
import { ValidationError } from '../../lib/errors';
import { logger } from '../../lib/logger';

type PayoutStatus = 'initiated' | 'settled' | 'failed';

// In-memory store for payout status
const payoutStore = new Map<string, PayoutStatus>();

export async function initiatePayout(req: Request, res: Response): Promise<void> {
  const { gigId, amountLKR } = req.body;
  
  if (!gigId || !amountLKR || typeof amountLKR !== 'number') {
    throw new ValidationError('gigId and amountLKR are required');
  }
  
  const payoutId = `pay_${Date.now()}`;
  
  if (env.USE_MOCK) {
    // Mock mode: set initial status and simulate webhook after 3s
    payoutStore.set(payoutId, 'initiated');
    
    logger.info(`Mock payout initiated: ${payoutId} for gig ${gigId}`);
    
    // Simulate webhook call after 3 seconds
    setTimeout(async () => {
      try {
        const webhookPayload = {
          payoutId,
          status: 'settled' as PayoutStatus,
          amountLKR,
          gigId
        };
        
        await fetch(`${env.PUBLIC_BASE_URL}/v1/payouts/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-paydpi-signature': generateMockSignature(JSON.stringify(webhookPayload))
          },
          body: JSON.stringify(webhookPayload)
        });
        
        logger.info(`Mock webhook sent for payout ${payoutId}`);
      } catch (error) {
        logger.error('Error sending mock webhook:', error);
      }
    }, 3000);
    
    res.status(200).json({
      payoutId,
      status: 'initiated'
    });
    return;
  }
  
  try {
    // Real API call to PayDPI
    const response = await fetch(`${env.PAYDPI_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.PAYDPI_MERCHANT_ID}`
      },
      body: JSON.stringify({
        amountLKR,
        gigId,
        merchantId: env.PAYDPI_MERCHANT_ID
      })
    });
    
    if (!response.ok) {
      throw new Error(`PayDPI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as { payoutId: string; status: PayoutStatus };
    
    // Store the payout status
    payoutStore.set(data.payoutId, data.status);
    
    logger.info(`Real payout initiated: ${data.payoutId}`);
    
    res.status(200).json({
      payoutId: data.payoutId,
      status: data.status
    });
  } catch (error) {
    logger.error('Error initiating payout:', error);
    throw new Error('Failed to initiate payout via National Payments Gateway');
  }
}

export function getPayoutStatus(req: Request, res: Response): void {
  const { payoutId } = req.query;
  
  if (!payoutId || typeof payoutId !== 'string') {
    throw new ValidationError('payoutId is required');
  }
  
  logger.info(`Looking for payout: ${payoutId}`);
  logger.info(`Available payouts: ${JSON.stringify(Array.from(payoutStore.entries()))}`);
  
  const status = payoutStore.get(payoutId);
  
  if (!status) {
    logger.warn(`Payout not found: ${payoutId}`);
    res.status(404).json({
      error: 'Payout not found'
    });
    return;
  }
  
  // Add cache-control headers to prevent caching
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  logger.info(`Returning payout status: ${payoutId} -> ${status}`);
  
  res.status(200).json({
    payoutId,
    status,
    timestamp: new Date().toISOString()
  });
}

function generateMockSignature(payload: string): string {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', env.PAYDPI_SECRET)
    .update(payload)
    .digest('hex');
}

export { payoutStore };