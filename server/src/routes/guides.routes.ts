import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../utils/http.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const guides = await prisma.guide.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      scholarship: true
    }
  });
  res.json({ guides });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      scholarship: true
    }
  });
  if (!guide) throw new HttpError(404, 'Guide not found');
  res.json({ guide });
}));

export default router;
