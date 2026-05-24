import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const query = z.object({
    search: z.string().optional(),
    country: z.string().optional()
  }).parse(req.query);

  const where: any = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { scholarship: { contains: query.search, mode: 'insensitive' } },
      { university: { contains: query.search, mode: 'insensitive' } },
      { bio: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  if (query.country) where.country = { equals: query.country, mode: 'insensitive' };

  const alumni = await prisma.alumni.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  res.json({ alumni });
}));

export default router;
