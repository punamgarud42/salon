/**
 * categoryTheme.js — one place mapping a category name to its gradient
 * pair. Used by ServiceCard, CourseCard, and Gallery so a category's color
 * identity stays consistent everywhere it appears, and adding a new
 * category is a one-line change here instead of an edit in three files.
 */
const CATEGORY_GRADIENT = {
  Hair: ['#7C8B6F', '#C9A15A'],
  Makeup: ['#C98A93', '#46523F'],
  Skin: ['#C9A15A', '#E4C583'],
  Mehendi: ['#C98A93', '#E4C583'],
  Bridal: ['#C98A93', '#C9A15A'],
  Academy: ['#46523F', '#C9A15A'],
};

const FALLBACK_GRADIENT = ['#C9A15A', '#C98A93'];

export function getCategoryGradient(category) {
  return CATEGORY_GRADIENT[category] ?? FALLBACK_GRADIENT;
}
