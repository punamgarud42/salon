import { Router } from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAdmin, me);

export default router;
