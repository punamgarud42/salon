import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import businessInfoRoutes from './businessInfo.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import uploadsRoutes from './uploads.routes.js';
import beforeAfterRoutes from './beforeAfter.routes.js';
import servicesRoutes from './services.routes.js';
import bookingsRoutes from './bookings.routes.js';
import coursesRoutes from './courses.routes.js';
import batchesRoutes from './batches.routes.js';
import enrollmentsRoutes from './enrollments.routes.js';
import contactRoutes from './contact.routes.js';
import galleryRoutes from './gallery.routes.js';
import testimonialsRoutes from './testimonials.routes.js';
import offersRoutes from './offers.routes.js';
import academyHighlightsRoutes from './academyHighlights.routes.js';
import paymentsRoutes from './payments.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);                         // added in Phase 8
router.use('/business-info', businessInfoRoutes);
router.use('/newsletter', newsletterRoutes);              // added in Phase 2
router.use('/services', servicesRoutes);                  // added in Phase 3
router.use('/bookings', bookingsRoutes);                  // added in Phase 3
router.use('/courses', coursesRoutes);                    // added in Phase 4
router.use('/batches', batchesRoutes);                    // added in Phase 4
router.use('/enrollments', enrollmentsRoutes);            // added in Phase 4
router.use('/contact', contactRoutes);                    // added in Phase 7
router.use('/gallery', galleryRoutes);                    // added in Phase 8
router.use('/testimonials', testimonialsRoutes);          // added in Phase 8
router.use('/offers', offersRoutes);                      // added in Phase 8
router.use('/academy-highlights', academyHighlightsRoutes); // added in Phase 8
router.use('/payments', paymentsRoutes);                  // added in Phase 9
router.use('/uploads', uploadsRoutes);                    // image uploads via Cloudinary
router.use('/before-after', beforeAfterRoutes);           // before/after photo pairs

export default router;
