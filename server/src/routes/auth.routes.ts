import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { comparePassword, hashPassword } from '../lib/password.js';
import { createJti, hashToken } from '../lib/token.js';
import { refreshCookieMaxAgeMs, signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const authSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(200)
});

const profileSchema = z.object({
  gpa: z.coerce.number().min(0).max(4).optional().nullable(),
  major: z.string().max(120).optional().nullable(),
  nationality: z.string().max(120).optional().nullable(),
  interests: z.array(z.string().max(60)).optional().nullable(),
  degreeLevel: z.string().max(60).optional().nullable(),
  targetCountry: z.string().max(120).optional().nullable(),
  bio: z.string().max(1000).optional().nullable()
});

function buildSessionTokens(user: { id: number; email: string; name: string }) {
  const jti = createJti();
  const refreshToken = signRefreshToken({ sub: String(user.id), jti });
  const accessToken = signAccessToken({ sub: String(user.id), email: user.email, name: user.name });
  const tokenHash = hashToken(refreshToken);
  return { jti, refreshToken, accessToken, tokenHash };
}

async function persistRefreshToken(userId: number, refreshToken: string, jti: string) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + refreshCookieMaxAgeMs());
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
  return { tokenHash, expiresAt, jti };
}

function setRefreshCookie(res: any, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshCookieMaxAgeMs(),
    path: '/api/auth'
  });
}

function clearRefreshCookie(res: any) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth'
  });
}

async function issueAuthResponse(res: any, user: { id: number; email: string; name: string }) {
  const jti = createJti();
  const refreshToken = signRefreshToken({ sub: String(user.id), jti });
  const accessToken = signAccessToken({ sub: String(user.id), email: user.email, name: user.name });
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshCookieMaxAgeMs())
    }
  });
  setRefreshCookie(res, refreshToken);
  return { accessToken, user };
}

router.post('/register', asyncHandler(async (req, res) => {
  const body = authSchema.parse(req.body);
  if (!body.name) throw new HttpError(400, 'Name is required');

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) throw new HttpError(409, 'An account with that email already exists');

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
      profileComplete: false
    }
  });

  const { accessToken } = await issueAuthResponse(res, user);
  res.status(201).json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileComplete: user.profileComplete
    }
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const body = authSchema.omit({ name: true }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) throw new HttpError(401, 'Invalid email or password');

  const ok = await comparePassword(body.password, user.password);
  if (!ok) throw new HttpError(401, 'Invalid email or password');

  const { accessToken } = await issueAuthResponse(res, user);
  res.json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileComplete: user.profileComplete
    }
  });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new HttpError(401, 'Missing refresh token');

  const payload = verifyRefreshToken(token);
  const tokenHash = hashToken(token);

  const dbToken = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!dbToken || dbToken.revokedAt || dbToken.expiresAt < new Date()) {
    throw new HttpError(401, 'Refresh token is no longer valid');
  }

  const newJti = createJti();
  const newRefreshToken = signRefreshToken({ sub: String(dbToken.user.id), jti: newJti });
  const accessToken = signAccessToken({
    sub: String(dbToken.user.id),
    email: dbToken.user.email,
    name: dbToken.user.name
  });

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: {
        revokedAt: new Date()
      }
    }),
    prisma.refreshToken.create({
      data: {
        userId: dbToken.user.id,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + refreshCookieMaxAgeMs())
      }
    })
  ]);

  setRefreshCookie(res, newRefreshToken);

  res.json({
    accessToken,
    user: {
      id: dbToken.user.id,
      name: dbToken.user.name,
      email: dbToken.user.email,
      profileComplete: dbToken.user.profileComplete
    }
  });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() }
    });
  }
  clearRefreshCookie(res);
  res.status(204).send();
}));

router.get('/me', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      gpa: true,
      major: true,
      nationality: true,
      interests: true,
      degreeLevel: true,
      targetCountry: true,
      bio: true,
      profileComplete: true,
      createdAt: true
    }
  });
  if (!user) throw new HttpError(404, 'User not found');
  res.json({ user });
}));

router.put('/profile', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const body = profileSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...body,
      profileComplete: true
    },
    select: {
      id: true,
      name: true,
      email: true,
      gpa: true,
      major: true,
      nationality: true,
      interests: true,
      degreeLevel: true,
      targetCountry: true,
      bio: true,
      profileComplete: true,
      createdAt: true
    }
  });
  res.json({ user });
}));

export default router;
