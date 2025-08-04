import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response): void {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString()
  });
}