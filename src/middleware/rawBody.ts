import { Request, Response, NextFunction } from 'express';

export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/v1/payouts/webhook' && req.method === 'POST') {
    let data = '';
    req.setEncoding('utf8');
    
    req.on('data', (chunk) => {
      data += chunk;
    });
    
    req.on('end', () => {
      (req as any).rawBody = Buffer.from(data, 'utf8');
      next();
    });
  } else {
    next();
  }
}