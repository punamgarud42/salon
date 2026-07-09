import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonials.controller.js';

const router = Router();

router.get('/', getAllTestimonials);
router.post('/', requireAdmin, createTestimonial);
router.put('/:id', requireAdmin, updateTestimonial);
router.delete('/:id', requireAdmin, deleteTestimonial);

export default router;
