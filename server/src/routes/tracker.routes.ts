import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

router.get('/overview', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const [saved, applications] = await prisma.$transaction([
    prisma.savedScholarship.findMany({
      where: { userId },
      include: {
        scholarship: true
      },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.application.findMany({
      where: { userId },
      include: {
        scholarship: true
      },
      orderBy: [
        { status: 'asc' },
        { updatedAt: 'desc' }
      ]
    })
  ]);

  const upcoming = [...saved.map((item: any) => item.scholarship), ...applications.map((app: any) => app.scholarship)]
    .filter((item: any, index: number, array: any[]) => array.findIndex((x: any) => x.id === item.id) === index)
    .sort((a: any, b: any) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 6);

  res.json({
    saved,
    applications,
    upcoming,
    counts: {
      saved: saved.length,
      applications: applications.length,
      upcoming: upcoming.length
    }
  });
}));

router.get('/saved', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const saved = await prisma.savedScholarship.findMany({
    where: { userId: req.user!.id },
    include: { scholarship: true },
    orderBy: { updatedAt: 'desc' }
  });
  res.json({ saved });
}));

router.patch('/saved/:scholarshipId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const scholarshipId = Number(req.params.scholarshipId);
  const body = z.object({
    reviewLater: z.boolean().optional(),
    note: z.string().max(1000).optional().nullable()
  }).parse(req.body);

  const scholarship = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
  if (!scholarship) throw new HttpError(404, 'Scholarship not found');

  const updated = await prisma.savedScholarship.upsert({
    where: {
      userId_scholarshipId: {
        userId: req.user!.id,
        scholarshipId
      }
    },
    update: {
      ...(body.reviewLater === undefined ? {} : { reviewLater: body.reviewLater }),
      ...(body.note === undefined ? {} : { note: body.note ?? null })
    },
    create: {
      userId: req.user!.id,
      scholarshipId,
      reviewLater: body.reviewLater ?? true,
      note: body.note ?? null
    },
    include: { scholarship: true }
  });

  res.json({ saved: updated });
}));

router.get('/applications', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const applications = await prisma.application.findMany({
    where: { userId: req.user!.id },
    include: { scholarship: true },
    orderBy: { updatedAt: 'desc' }
  });
  res.json({ applications });
}));

router.post('/applications', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = z.object({
    scholarshipId: z.number().int(),
    notes: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'SAVED', 'APPLIED', 'INTERVIEW', 'AWARDED', 'REJECTED']).optional()
  }).parse(req.body);

  const scholarship = await prisma.scholarship.findUnique({ where: { id: body.scholarshipId } });
  if (!scholarship) throw new HttpError(404, 'Scholarship not found');

  const application = await prisma.application.upsert({
    where: {
      userId_scholarshipId: {
        userId: req.user!.id,
        scholarshipId: body.scholarshipId
      }
    },
    update: {
      notes: body.notes ?? undefined,
      status: body.status ?? 'SAVED'
    },
    create: {
      userId: req.user!.id,
      scholarshipId: body.scholarshipId,
      notes: body.notes ?? undefined,
      status: body.status ?? 'SAVED'
    },
    include: { scholarship: true }
  });

  res.status(201).json({ application });
}));

router.patch('/applications/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = z.object({
    notes: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'SAVED', 'APPLIED', 'INTERVIEW', 'AWARDED', 'REJECTED']).optional()
  }).parse(req.body);

  const id = Number(req.params.id);
  const application = await prisma.application.findFirst({
    where: { id, userId: req.user!.id }
  });

  if (!application) throw new HttpError(404, 'Application not found');

  const updated = await prisma.application.update({
    where: { id },
    data: {
      notes: body.notes ?? undefined,
      status: body.status ?? undefined
    },
    include: { scholarship: true }
  });

  res.json({ application: updated });
}));

router.delete('/saved/:scholarshipId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const scholarshipId = Number(req.params.scholarshipId);
  await prisma.savedScholarship.deleteMany({
    where: {
      userId: req.user!.id,
      scholarshipId
    }
  });
  res.status(204).send();
}));

export default router;
