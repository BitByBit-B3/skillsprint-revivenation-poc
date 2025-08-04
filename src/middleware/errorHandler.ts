import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  if (error instanceof AppError && error.isOperational) {
    res.status(error.statusCode).json({
      error: error.message
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: 'Internal server error'
  });
}