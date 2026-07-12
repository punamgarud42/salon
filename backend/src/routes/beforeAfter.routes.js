import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllBeforeAfter, createBeforeAfter, updateBeforeAfter, deleteBeforeAfter } from '../controllers/beforeAfter.controller.js';

const router = Router();

router.get('/', getAllBeforeAfter);
router.post('/', requireAdmin, createBeforeAfter);
router.put('/:id', requireAdmin, updateBeforeAfter);
router.delete('/:id', requireAdmin, deleteBeforeAfter);

export default router;
