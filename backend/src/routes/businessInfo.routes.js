import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getBusinessInfo, updateBusinessInfo } from '../controllers/businessInfo.controller.js';

const router = Router();

router.get('/', getBusinessInfo);
router.put('/', requireAdmin, updateBusinessInfo);

export default router;
