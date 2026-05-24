import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const stories = await prisma.successStory.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      scholarship: true,
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
  res.json({ stories });
}));

export default router;
