import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { scoreScholarship } from '../services/match.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();

const matchSchema = z.object({
  gpa: z.coerce.number().min(0).max(4).optional(),
  major: z.string().optional(),
  nationality: z.string().optional(),
  interests: z.array(z.string()).optional(),
  degreeLevel: z.string().optional(),
  targetCountry: z.string().optional(),
  saveProfile: z.boolean().optional().default(false)
});

router.post('/', asyncHandler(async (req, res) => {
  const profile = matchSchema.parse(req.body);

  const scholarships = await prisma.scholarship.findMany({
    orderBy: { deadline: 'asc' }
  });

  const ranked = scholarships
    .map((s: any) => scoreScholarship(s, profile))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 12);

  if (profile.saveProfile && req.headers.authorization?.startsWith('Bearer ')) {
    // profile persistence is handled through the authenticated /auth/profile route.
  }

  res.json({
    profile,
    matches: ranked
  });
}));

export default router;
