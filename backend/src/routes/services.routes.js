import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllServices, createService, updateService, deleteService } from '../controllers/services.controller.js';

const router = Router();

router.get('/', getAllServices);
router.post('/', requireAdmin, createService);
router.put('/:id', requireAdmin, updateService);
router.delete('/:id', requireAdmin, deleteService);

export default router;
