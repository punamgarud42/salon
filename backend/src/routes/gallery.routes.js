import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller.js';

const router = Router();

router.get('/', getAllGalleryItems);
router.post('/', requireAdmin, createGalleryItem);
router.put('/:id', requireAdmin, updateGalleryItem);
router.delete('/:id', requireAdmin, deleteGalleryItem);

export default router;
