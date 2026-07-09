import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAvailability, createBooking, listBookings, updateBookingStatus } from '../controllers/bookings.controller.js';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', createBooking);
router.get('/', requireAdmin, listBookings);
router.put('/:id/status', requireAdmin, updateBookingStatus);

export default router;
