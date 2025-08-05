import express from 'express';
import helmet from 'helmet';
import { env, validateEnv } from '../lib/env';
import { logger, logRequest } from '../lib/logger';
import { corsMiddleware } from '../middleware/cors';
import { errorHandler } from '../middleware/errorHandler';

// Routes
import { healthCheck } from './routes/health';
import { login, verify, getClaims, health as authHealth } from './routes/auth';
import { getEducationRecord } from './routes/nde';
import { getGigs } from './routes/gigs';
import { initiatePayout, getPayoutStatus } from './routes/paydpi';
import { handlePayoutWebhook } from './routes/webhook';

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req.method, req.path, res.statusCode, duration);
  });
  
  next();
});

// Webhook route MUST come before express.json() to handle raw body
app.post('/v1/payouts/webhook', express.raw({ type: 'application/json' }), handlePayoutWebhook);

// JSON parsing middleware for all other routes
app.use(express.json());

// Routes
app.get('/health', healthCheck);

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/verify', verify);
app.get('/api/auth/claims', getClaims);
app.get('/api/auth/health', authHealth);

// National Data Exchange
app.post('/api/nde/education', getEducationRecord);

// Gigs API
app.get('/v1/gigs', getGigs);

// Payment API
app.post('/api/paydpi', initiatePayout);
app.get('/api/paydpi/status', getPayoutStatus);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 SkillSprint API server running on port ${env.PORT}`);
  logger.info(`📖 Mode: ${env.USE_MOCK ? 'Mock' : 'Sandbox'}`);
  logger.info(`🌐 Base URL: ${env.PUBLIC_BASE_URL}`);
  logger.info(`🎯 Web Origin: ${env.WEB_ORIGIN}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default app;