import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export function logRequest(method: string, path: string, statusCode: number, duration: number): void {
  logger.info(JSON.stringify({
    method,
    path,
    statusCode,
    duration: `${duration}ms`
  }));
}