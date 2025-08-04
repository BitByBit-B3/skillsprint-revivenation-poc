import cors from 'cors';
import { env } from '../lib/env';

export const corsMiddleware = cors({
  origin: [env.WEB_ORIGIN, env.PUBLIC_BASE_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-paydpi-signature', 'x-session-id', 'Cache-Control', 'Pragma']
});