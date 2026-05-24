import { Router } from 'express';
import authRoutes from './auth.routes.js';
import scholarshipsRoutes from './scholarships.routes.js';
import matchRoutes from './match.routes.js';
import storiesRoutes from './stories.routes.js';
import alumniRoutes from './alumni.routes.js';
import guidesRoutes from './guides.routes.js';
import trackerRoutes from './tracker.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/scholarships', scholarshipsRoutes);
router.use('/matches', matchRoutes);
router.use('/stories', storiesRoutes);
router.use('/alumni', alumniRoutes);
router.use('/guides', guidesRoutes);
router.use('/tracker', trackerRoutes);

export default router;
