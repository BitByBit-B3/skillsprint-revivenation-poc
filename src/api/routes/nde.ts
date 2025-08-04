import { Request, Response } from 'express';
import { env } from '../../lib/env';
import { ValidationError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import educationRecord from '../../fixtures/education-record.sample.json';

export async function getEducationRecord(req: Request, res: Response): Promise<void> {
  const { subject } = req.body;
  
  if (!subject || typeof subject !== 'string') {
    throw new ValidationError('Subject DID is required');
  }
  
  if (env.USE_MOCK) {
    logger.info(`Fetching education record for ${subject} (mock mode)`);
    res.status(200).json(educationRecord);
    return;
  }
  
  try {
    // Real API call to National Data Exchange
    const response = await fetch(`${env.NDX_BASE_URL}/education-records?subject=${encodeURIComponent(subject)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.NDX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NDX API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    logger.info(`Fetched education record for ${subject} from NDX`);
    
    res.status(200).json(data);
  } catch (error) {
    logger.error('Error fetching from NDX:', error);
    throw new Error('Failed to fetch education record from National Data Exchange');
  }
}