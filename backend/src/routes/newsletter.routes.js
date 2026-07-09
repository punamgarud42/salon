import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { subscribe, listSubscribers } from '../controllers/newsletter.controller.js';

const router = Router();

router.post('/subscribe', subscribe);
router.get('/subscribers', requireAdmin, listSubscribers);

export default router;
