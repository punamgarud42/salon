import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offers.controller.js';

const router = Router();

router.get('/', getAllOffers);
router.post('/', requireAdmin, createOffer);
router.put('/:id', requireAdmin, updateOffer);
router.delete('/:id', requireAdmin, deleteOffer);

export default router;
