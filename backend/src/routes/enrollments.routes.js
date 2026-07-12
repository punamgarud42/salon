import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { sanitiseBody } from '../middleware/sanitise.js';
import { createEnrollment, listEnrollments, updateEnrollmentStatus } from '../controllers/enrollments.controller.js';

const router = Router();

router.post('/', sanitiseBody, createEnrollment);
router.get('/', requireAdmin, listEnrollments);
router.put('/:id/status', requireAdmin, updateEnrollmentStatus);

export default router;
