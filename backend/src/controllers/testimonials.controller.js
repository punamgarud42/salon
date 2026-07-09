import Testimonial from '../models/Testimonial.model.js';
import { createCrudController } from '../utils/crudFactory.js';

const DEFAULT_TESTIMONIALS = [
  { name: 'Ananya R.', role: 'Bridal client', rating: 5, quote: 'My bridal look lasted the entire wedding without a single touch-up. Genuinely the best decision I made.', featured: true },
  { name: 'Priya D.', role: 'Regular client, 2 years', rating: 5, quote: 'The facials here changed my skin. The staff actually listen to what you want instead of upselling.', featured: true },
  { name: 'Sneha K.', role: 'Academy graduate, 2024 batch', rating: 5, quote: 'I walked in knowing nothing about hairdressing and walked out with a job offer before graduation.', featured: true },
  { name: 'Ritika M.', role: 'Hair color client', rating: 4, quote: 'Colour came out exactly like the reference photo I brought in. Small wait on a Saturday but worth it.', featured: false },
  { name: 'Kavya S.', role: 'Mehendi client', rating: 5, quote: 'Booked bridal mehendi for my sister — the detailing was incredible and it stayed dark for over two weeks.', featured: false },
  { name: 'Divya P.', role: 'Makeup Artistry student', rating: 5, quote: 'Small batch sizes meant I actually got hands-on time every single class, not just demonstrations.', featured: false },
  { name: 'Meera J.', role: 'Party makeup client', rating: 4, quote: 'Great party makeup that held up through a long evening. Would book again for any event.', featured: false },
  { name: 'Isha T.', role: 'Skin & facial client', rating: 5, quote: "The skin consultation before my facial was more thorough than most dermatologist visits I've had.", featured: false },
];

export const { getAll: getAllTestimonials, create: createTestimonial, update: updateTestimonial, remove: deleteTestimonial } =
  createCrudController(Testimonial, DEFAULT_TESTIMONIALS);
