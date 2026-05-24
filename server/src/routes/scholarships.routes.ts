import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const listSchema = z.object({
  search: z.string().trim().optional(),
  field: z.string().trim().optional(),
  country: z.string().trim().optional(),
  degreeLevel: z.string().trim().optional(),
  provider: z.string().trim().optional(),
  minAmount: z.coerce.number().int().min(0).optional(),
  maxAmount: z.coerce.number().int().min(0).optional(),
  deadlineBefore: z.string().trim().optional(),
  deadlineAfter: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(['deadline_asc', 'deadline_desc', 'amount_desc', 'recent']).default('deadline_asc')
});

const createSchema = z.object({
  name: z.string().min(4).max(160),
  description: z.string().min(30).max(1000),
  amount: z.coerce.number().int().min(0),
  currency: z.string().min(2).max(8).default('USD'),
  deadline: z.string().datetime().or(z.string().date()).or(z.string().min(8)),
  country: z.string().min(2).max(120),
  field: z.string().min(2).max(120),
  degreeLevel: z.string().min(2).max(80),
  provider: z.string().min(2).max(120),
  url: z.string().url(),
  isExternal: z.boolean().optional().default(true)
});

function parseDate(value?: string, boundary: 'start' | 'end' = 'start') {
  if (!value) return undefined;
  const parsed = new Date(
    value.length === 10
      ? `${value}T${boundary === 'start' ? '00:00:00.000' : '23:59:59.999'}Z`
      : value
  );
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

router.get('/', asyncHandler(async (req, res) => {
  const query = listSchema.parse(req.query);
  const where: any = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { field: { contains: query.search, mode: 'insensitive' } },
      { country: { contains: query.search, mode: 'insensitive' } },
      { provider: { contains: query.search, mode: 'insensitive' } }
    ];
  }

  if (query.field) where.field = { contains: query.field, mode: 'insensitive' };
  if (query.country) where.country = { contains: query.country, mode: 'insensitive' };
  if (query.degreeLevel) where.degreeLevel = { contains: query.degreeLevel, mode: 'insensitive' };
  if (query.provider) where.provider = { contains: query.provider, mode: 'insensitive' };

  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    where.amount = {};
    if (query.minAmount !== undefined) where.amount.gte = query.minAmount;
    if (query.maxAmount !== undefined) where.amount.lte = query.maxAmount;
  }

  const deadlineAfter = parseDate(query.deadlineAfter, 'start');
  const deadlineBefore = parseDate(query.deadlineBefore, 'end');
  if (deadlineAfter || deadlineBefore) {
    where.deadline = {};
    if (deadlineAfter) where.deadline.gte = deadlineAfter;
    if (deadlineBefore) where.deadline.lte = deadlineBefore;
  }

  const orderBy =
    query.sort === 'amount_desc'
      ? { amount: 'desc' as const }
      : query.sort === 'recent'
        ? { createdAt: 'desc' as const }
        : query.sort === 'deadline_desc'
          ? { deadline: 'desc' as const }
          : { deadline: 'asc' as const };

  const [items, total] = await prisma.$transaction([
    prisma.scholarship.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        guide: true,
        _count: {
          select: { savedBy: true, applications: true, stories: true }
        }
      }
    }),
    prisma.scholarship.count({ where })
  ]);

  res.json({
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.max(1, Math.ceil(total / query.limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
    include: {
      guide: true,
      stories: true,
      _count: {
        select: { savedBy: true, applications: true, stories: true }
      }
    }
  });
  if (!scholarship) throw new HttpError(404, 'Scholarship not found');
  res.json({ scholarship });
}));

router.post('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = createSchema.parse(req.body);
  const scholarship = await prisma.scholarship.create({
    data: {
      ...body,
      deadline: new Date(body.deadline)
    },
    include: {
      guide: true,
      _count: {
        select: { savedBy: true, applications: true, stories: true }
      }
    }
  });
  res.status(201).json({ scholarship });
}));

router.post('/:id/save', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const scholarshipId = Number(req.params.id);

  const exists = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
  if (!exists) throw new HttpError(404, 'Scholarship not found');

  await prisma.savedScholarship.upsert({
    where: { userId_scholarshipId: { userId, scholarshipId } },
    update: {},
    create: { userId, scholarshipId }
  });

  const saved = await prisma.savedScholarship.findUnique({
    where: { userId_scholarshipId: { userId, scholarshipId } },
    include: { scholarship: true }
  });

  res.status(201).json({ saved });
}));

router.delete('/:id/save', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const scholarshipId = Number(req.params.id);
  await prisma.savedScholarship.deleteMany({ where: { userId, scholarshipId } });
  res.status(204).send();
}));

router.post('/:id/apply', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const scholarshipId = Number(req.params.id);
  const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() : null;

  const scholarship = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
  if (!scholarship) throw new HttpError(404, 'Scholarship not found');

  const application = await prisma.application.upsert({
    where: {
      userId_scholarshipId: {
        userId,
        scholarshipId
      }
    },
    update: {
      status: 'APPLIED',
      notes: notes ?? undefined
    },
    create: {
      userId,
      scholarshipId,
      status: 'APPLIED',
      notes
    },
    include: { scholarship: true }
  });

  res.status(201).json({ application });
}));

export default router;
