import dotenv from 'dotenv';

dotenv.config();

export const env = {
  USE_MOCK: process.env.USE_MOCK === 'true',
  
  // Government Sign-In
  SLUDI_ISSUER: process.env.SLUDI_ISSUER || 'https://mosip.example/auth',
  SLUDI_CLIENT_ID: process.env.SLUDI_CLIENT_ID || '',
  SLUDI_CLIENT_SECRET: process.env.SLUDI_CLIENT_SECRET || '',
  SLUDI_REDIRECT_URI: process.env.SLUDI_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
  
  // National Data Exchange
  NDX_BASE_URL: process.env.NDX_BASE_URL || 'https://choreo-domain/education',
  NDX_API_KEY: process.env.NDX_API_KEY || 'your-choreo-token',
  
  // National Payments Gateway
  PAYDPI_BASE_URL: process.env.PAYDPI_BASE_URL || 'https://payments.sandbox.example',
  PAYDPI_MERCHANT_ID: process.env.PAYDPI_MERCHANT_ID || 'demo-merchant',
  PAYDPI_SECRET: process.env.PAYDPI_SECRET || 'supersecret',
  
  // Web / API
  PORT: parseInt(process.env.PORT || '3003'),
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'http://localhost:3003',
  WEB_ORIGIN: process.env.WEB_ORIGIN || 'http://localhost:3000'
};

export function validateEnv(): void {
  if (!env.USE_MOCK) {
    const required = [
      'SLUDI_CLIENT_ID',
      'SLUDI_CLIENT_SECRET', 
      'NDX_BASE_URL',
      'NDX_API_KEY',
      'PAYDPI_BASE_URL',
      'PAYDPI_MERCHANT_ID',
      'PAYDPI_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables when USE_MOCK=false: ${missing.join(', ')}`);
    }
  }
}