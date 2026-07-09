import GalleryItem from '../models/GalleryItem.model.js';
import { createCrudController } from '../utils/crudFactory.js';

/**
 * `photo` values are real stock photography from Pexels — free for
 * commercial use, no attribution required (see the matching comment in
 * frontend/src/data/galleryFull.js, which this list mirrors so a fresh
 * database seeds with the same starting content the frontend's offline
 * fallback shows).
 */
const DEFAULT_GALLERY_ITEMS = [
  { category: 'Bridal', icon: 'veil', title: 'Bridal Look, Reception Day', size: 'tall', photo: 'https://images.pexels.com/photos/34955448/pexels-photo-34955448.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Hair', icon: 'scissors', title: 'Balayage Finish', size: null, photo: 'https://images.pexels.com/photos/3993320/pexels-photo-3993320.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Makeup', icon: 'lipstick', title: 'Editorial Glam', size: 'wide', photo: 'https://images.pexels.com/photos/6161/makeup-make-up-artist-make-up.jpg?auto=compress&cs=tinysrgb&w=1200' },
  { category: 'Skin', icon: 'leaf', title: 'Post-Facial Glow', size: null, photo: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Mehendi', icon: 'henna', title: 'Bridal Mehendi Detail', size: 'tall', photo: 'https://images.pexels.com/photos/5602783/pexels-photo-5602783.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Academy', icon: 'graduationCap', title: 'Student Practicum Day', size: null, photo: 'https://images.pexels.com/photos/13068359/pexels-photo-13068359.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Hair', icon: 'scissors', title: 'Layered Cut', size: null, photo: 'https://images.pexels.com/photos/19664876/pexels-photo-19664876.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Makeup', icon: 'lipstick', title: 'Party-Ready Makeup', size: null, photo: 'https://images.pexels.com/photos/37710473/pexels-photo-37710473.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Bridal', icon: 'veil', title: 'Reception Saree Draping', size: 'wide', photo: 'https://images.pexels.com/photos/24549077/pexels-photo-24549077.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { category: 'Skin', icon: 'leaf', title: 'Express Clean-Up Result', size: null, photo: 'https://images.pexels.com/photos/5240815/pexels-photo-5240815.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Mehendi', icon: 'henna', title: 'Festive Occasion Mehendi', size: null, photo: 'https://images.pexels.com/photos/4987379/pexels-photo-4987379.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { category: 'Academy', icon: 'graduationCap', title: 'Graduation Day', size: 'tall', photo: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export const { getAll: getAllGalleryItems, create: createGalleryItem, update: updateGalleryItem, remove: deleteGalleryItem } =
  createCrudController(GalleryItem, DEFAULT_GALLERY_ITEMS);
