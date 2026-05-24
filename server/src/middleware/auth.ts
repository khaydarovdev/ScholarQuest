import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';
import { HttpError } from '../utils/http.js';

export type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    email: string;
    name: string;
  };
};

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, 'Missing access token'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name
    };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired access token'));
  }
}
