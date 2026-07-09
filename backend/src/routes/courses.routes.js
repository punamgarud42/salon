import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courses.controller.js';

const router = Router();

router.get('/', getAllCourses);
router.post('/', requireAdmin, createCourse);
router.put('/:id', requireAdmin, updateCourse);
router.delete('/:id', requireAdmin, deleteCourse);

export default router;
