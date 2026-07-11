import bridalMakeupImage from '../../assets/images/Bridal makeup.webp';
import bridalMehndiImage from '../../assets/images/bridal mehndi.jpeg';
import cleanupImage from '../../assets/images/clean up.jpeg';
import facialImage from '../../assets/images/facial.jpeg';
import hairColorImage from '../../assets/images/hair color.jpeg';
import hairSpaImage from '../../assets/images/hair spa.webp';
import hairStyleImage from '../../assets/images/hair style.webp';
import mehendiImage from '../../assets/images/mehndi.jpeg';
import partyMakeupImage from '../../assets/images/party makeup.jpeg';
import simpleHairImage from '../../assets/images/simple hair.jpg';
import threadingImage from '../../assets/images/threading.jpeg';

const serviceImageMap = {
  'svc-hair-styling': hairStyleImage,
  'svc-hair-spa': hairSpaImage,
  'svc-hair-color': hairColorImage,
  'svc-bridal-makeup': bridalMakeupImage,
  'svc-party-makeup': partyMakeupImage,
  'svc-skin-glow': facialImage,
  'svc-skin-cleanup': cleanupImage,
  'svc-mehendi': bridalMehndiImage,
  'svc-mehendi-simple': mehendiImage,
};

function normalize(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function getServiceImage(service) {
  if (!service) return simpleHairImage;

  if (service.image) return service.image;

  const idKey = normalize(service.id);
  if (serviceImageMap[idKey]) return serviceImageMap[idKey];

  const nameKey = normalize(service.name);
  if (nameKey.includes('hairstyling') || nameKey.includes('hairstyle')) return hairStyleImage;
  if (nameKey.includes('hairspa') || nameKey.includes('hairspa')) return hairSpaImage;
  if (nameKey.includes('haircolor') || nameKey.includes('haircolor')) return hairColorImage;
  if (nameKey.includes('bridalmakeup') || nameKey.includes('bridal')) return bridalMakeupImage;
  if (nameKey.includes('partymakeup') || nameKey.includes('party')) return partyMakeupImage;
  if (nameKey.includes('facial') || nameKey.includes('skin')) return facialImage;
  if (nameKey.includes('cleanup') || nameKey.includes('clean')) return cleanupImage;
  if (nameKey.includes('mehendi') || nameKey.includes('mehndi')) return bridalMehndiImage;
  if (nameKey.includes('threading')) return threadingImage;

  return simpleHairImage;
}
