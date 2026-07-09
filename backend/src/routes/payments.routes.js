import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  lookupPayment,
  createOrder,
  verifyPayment,
  confirmDemoPayment,
  listPayments,
} from '../controllers/payments.controller.js';

const router = Router();

router.get('/lookup', lookupPayment);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/demo-confirm', confirmDemoPayment);
router.get('/', requireAdmin, listPayments);

export default router;
