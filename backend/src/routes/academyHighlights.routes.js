import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllAcademyHighlights, createAcademyHighlight, updateAcademyHighlight, deleteAcademyHighlight } from '../controllers/academyHighlights.controller.js';

const router = Router();

router.get('/', getAllAcademyHighlights);
router.post('/', requireAdmin, createAcademyHighlight);
router.put('/:id', requireAdmin, updateAcademyHighlight);
router.delete('/:id', requireAdmin, deleteAcademyHighlight);

export default router;
