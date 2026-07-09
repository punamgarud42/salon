import AcademyHighlight from '../models/AcademyHighlight.model.js';
import { createCrudController } from '../utils/crudFactory.js';

const DEFAULT_HIGHLIGHTS = [
  { title: 'Government-Certified Courses', detail: 'Recognised diplomas in cosmetology and hairdressing.' },
  { title: '100% Placement Support', detail: 'Salon partnerships across the city for graduating students.' },
  { title: 'Hands-On, Small Batches', detail: 'Capped batch sizes so every student gets real practice time.' },
];

export const { getAll: getAllAcademyHighlights, create: createAcademyHighlight, update: updateAcademyHighlight, remove: deleteAcademyHighlight } =
  createCrudController(AcademyHighlight, DEFAULT_HIGHLIGHTS);
