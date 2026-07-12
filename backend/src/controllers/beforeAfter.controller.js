import BeforeAfter from '../models/BeforeAfter.model.js';
import { createCrudController } from '../utils/crudFactory.js';

const DEFAULT_BEFORE_AFTER = [
  { category: 'Hair', label: 'Hair Color & Style Transformation', beforePhoto: '', afterPhoto: '', active: true },
  { category: 'Skin', label: 'Facial Treatment Glow-Up', beforePhoto: '', afterPhoto: '', active: true },
  { category: 'Makeup', label: 'Bridal Makeup Transformation', beforePhoto: '', afterPhoto: '', active: true },
  { category: 'Mehendi', label: 'Mehendi Depth & Stain Development', beforePhoto: '', afterPhoto: '', active: true },
];

export const {
  getAll: getAllBeforeAfter,
  create: createBeforeAfter,
  update: updateBeforeAfter,
  remove: deleteBeforeAfter,
} = createCrudController(BeforeAfter, DEFAULT_BEFORE_AFTER);
