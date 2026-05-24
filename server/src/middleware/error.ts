import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http.js';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'Route not found'));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';
  const details = err instanceof HttpError ? err.details : undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {})
    }
  });
}
