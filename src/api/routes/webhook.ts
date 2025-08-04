import { Request, Response } from 'express';
import { verifyHmacSignature } from '../../lib/signature';
import { env } from '../../lib/env';
import { AuthenticationError, ValidationError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { payoutStore } from './paydpi';

interface WebhookPayload {
  payoutId: string;
  status: 'settled' | 'failed';
  amountLKR: number;
  gigId: string;
}

// Store processed events for idempotency
const processedEvents = new Set<string>();

export function handlePayoutWebhook(req: Request, res: Response): void {
  const signature = req.headers['x-paydpi-signature'] as string;
  const rawBody = req.body as Buffer;
  
  if (!signature) {
    throw new AuthenticationError('Missing signature header');
  }
  
  if (!rawBody || rawBody.length === 0) {
    throw new ValidationError('Missing request body');
  }
  
  // Verify HMAC signature
  if (!verifyHmacSignature(rawBody, signature, env.PAYDPI_SECRET)) {
    logger.warn('Invalid webhook signature received');
    throw new AuthenticationError('Invalid signature');
  }
  
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody.toString());
  } catch (error) {
    throw new ValidationError('Invalid JSON payload');
  }
  
  // Validate payload structure
  if (!payload.payoutId || !payload.status || !payload.amountLKR || !payload.gigId) {
    throw new ValidationError('Invalid webhook payload structure');
  }
  
  // Create idempotency key
  const idempotencyKey = `${payload.payoutId}_${payload.status}`;
  
  // Check if already processed
  if (processedEvents.has(idempotencyKey)) {
    logger.info(`Duplicate webhook event ignored: ${idempotencyKey}`);
    res.status(204).send();
    return;
  }
  
  // Update payout status
  payoutStore.set(payload.payoutId, payload.status);
  processedEvents.add(idempotencyKey);
  
  logger.info(`Webhook processed: ${payload.payoutId} -> ${payload.status}`);
  
  res.status(204).send();
}