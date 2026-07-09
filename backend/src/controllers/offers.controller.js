import Offer from '../models/Offer.model.js';
import { createCrudController } from '../utils/crudFactory.js';

const DAY = 1000 * 60 * 60 * 24;

const DEFAULT_OFFERS = [
  { title: 'Monsoon Glow Package', description: '20% off any facial + hair spa combo, this month only.', discountLabel: '20% OFF', code: 'MONSOON20', category: 'Skin', endsAt: new Date(Date.now() + DAY * 9) },
  { title: 'Bridal Season Special', description: 'Book your bridal package early and save on makeup + mehendi combos.', discountLabel: '15% OFF', code: 'BRIDAL15', category: 'Bridal', endsAt: new Date(Date.now() + DAY * 20) },
  { title: 'Academy Early Bird', description: 'Enroll 2 weeks before batch start and get ₹2,000 off your course fee.', discountLabel: '₹2,000 OFF', code: 'EARLYBIRD', category: 'Academy', endsAt: new Date(Date.now() + DAY * 15) },
  { title: 'Festival Mehendi Offer', description: 'Flat discount on all festive mehendi bookings this season.', discountLabel: '10% OFF', code: 'FESTIVE10', category: 'Mehendi', endsAt: new Date(Date.now() + DAY * 5) },
  { title: 'First Visit Welcome Offer', description: 'New clients get a flat discount on their first salon service.', discountLabel: '₹200 OFF', code: 'WELCOME200', category: 'Hair', endsAt: new Date(Date.now() + DAY * 30) },
];

export const { getAll: getAllOffers, create: createOffer, update: updateOffer, remove: deleteOffer } =
  createCrudController(Offer, DEFAULT_OFFERS);
