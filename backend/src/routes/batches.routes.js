import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batches.controller.js';

const router = Router();

router.get('/', getAllBatches);
router.post('/', requireAdmin, createBatch);
router.put('/:id', requireAdmin, updateBatch);
router.delete('/:id', requireAdmin, deleteBatch);

export default router;
