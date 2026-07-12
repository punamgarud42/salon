import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { sanitiseBody } from '../middleware/sanitise.js';
import { createContactMessage, listContactMessages, updateContactMessageStatus } from '../controllers/contact.controller.js';

const router = Router();

router.post('/', sanitiseBody, createContactMessage);
router.get('/', requireAdmin, listContactMessages);
router.put('/:id/status', requireAdmin, updateContactMessageStatus);

export default router;
