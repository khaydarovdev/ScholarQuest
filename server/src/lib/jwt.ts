import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '30d';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, getEnv('JWT_ACCESS_SECRET'), { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, getEnv('JWT_REFRESH_SECRET'), { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getEnv('JWT_ACCESS_SECRET')) as AccessTokenPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getEnv('JWT_REFRESH_SECRET')) as RefreshTokenPayload & jwt.JwtPayload;
}

export function refreshCookieMaxAgeMs() {
  return 30 * 24 * 60 * 60 * 1000;
}
