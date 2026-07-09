import Course from '../models/Course.model.js';
import { withId, withIds } from '../utils/withId.js';

const DEFAULT_COURSES = [
  { name: 'Professional Hairdressing Diploma', description: 'A comprehensive diploma covering cutting, coloring, styling and salon management.', fee: 45000, duration: '6 months', mode: 'Full-time', category: 'Hair', icon: 'graduationCap', eligibility: '10th pass or above, no prior experience required.' },
  { name: 'Hair Cutting & Styling Fundamentals', description: 'A focused short course in modern cutting techniques and blow-dry styling.', fee: 12000, duration: '4 weeks', mode: 'Weekend', category: 'Hair', icon: 'scissors', eligibility: 'Open to beginners; no prior experience required.' },
  { name: 'Advanced Makeup Artistry', description: 'HD, airbrush and editorial makeup techniques with a live-model practicum.', fee: 35000, duration: '3 months', mode: 'Weekend', category: 'Makeup', icon: 'lipstick', eligibility: '12th pass or above, basic makeup knowledge preferred.' },
  { name: 'Certificate in Skincare & Facials', description: 'Skin analysis, facials and treatment protocols using professional-grade products.', fee: 18000, duration: '6 weeks', mode: 'Full-time', category: 'Skin', icon: 'leaf', eligibility: '10th pass or above, no prior experience required.' },
  { name: 'Bridal Mehendi Mastery', description: 'Traditional and Indo-Arabic bridal mehendi design, from fine lines to full hands.', fee: 12000, duration: '4 weeks', mode: 'Weekend', category: 'Mehendi', icon: 'henna', eligibility: 'Open to beginners; a steady hand and patience recommended.' },
  { name: 'Bridal Styling & Draping', description: 'Saree draping, bridal hairstyling and complete look coordination for wedding season.', fee: 22000, duration: '8 weeks', mode: 'Weekend', category: 'Bridal', icon: 'veil', eligibility: 'Basic hairstyling or makeup background preferred, not mandatory.' },
];

export async function getAllCourses(req, res) {
  try {
    let courses = await Course.find().sort({ createdAt: 1 });
    if (courses.length === 0) {
      courses = await Course.insertMany(DEFAULT_COURSES);
    }
    res.json(withIds(courses));
  } catch (err) {
    console.error('[courses] getAllCourses failed:', err);
    res.status(500).json({ error: 'Could not load courses.' });
  }
}

export async function createCourse(req, res) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(withId(course));
  } catch (err) {
    console.error('[courses] createCourse failed:', err);
    res.status(400).json({ error: 'Could not create course.' });
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(withId(course));
  } catch (err) {
    console.error('[courses] updateCourse failed:', err);
    res.status(400).json({ error: 'Could not update course.' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    console.error('[courses] deleteCourse failed:', err);
    res.status(500).json({ error: 'Could not delete course.' });
  }
}
