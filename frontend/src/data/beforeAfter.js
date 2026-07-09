import { getItem } from '../lib/storage';
import bridalMakeupImage from '../assets/images/Bridal makeup.webp';
import bridalMehndiImage from '../assets/images/bridal mehndi.jpeg';
import cleanupImage from '../assets/images/aftercleanup.jpeg';
import facialImage from '../assets/images/aftercleanup.jpeg';
import hairStyleImage from '../assets/images/hair style.webp';
import hairColorImage from '../assets/images/hair color.jpeg';
import hairSpaImage from '../assets/images/hair color.jpeg';
import mehendiImage from '../assets/images/mehndi.jpeg';
import simpleface from '../assets/images/simpleface.webp';
import simplehand from '../assets/images/simplehand.jpeg';
import simplehair from '../assets/images/simple hair.jpg';
import partyMakeupImage from '../assets/images/party makeup.jpeg';


/**
 * Before/after pairs, one per category.
 *
 * The BeforeAfterSlider component is fully functional (drag/touch/keyboard work).
 * Each pair now uses image URLs. To add images from Google:
 *
 * METHOD 1: Use Google Drive (Recommended)
 *   1. Upload your image to Google Drive
 *   2. Right-click → Share → Change to "Anyone with the link can view"
 *   3. Copy share link and extract the FILE_ID:
 *      https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 *   4. Use this direct image URL:
 *      https://drive.google.com/uc?export=view&id={FILE_ID}
 *
 * METHOD 2: Use Imgix or similar CDN
 *   - Upload to Imgix and use the CDN URL
 *
 * METHOD 3: Use your own server
 *   - Upload images to your backend and reference them
 *
 * Current images use placeholder URLs - replace with real Google Drive links above
 */
const DEFAULT_BEFORE_AFTER = [
  { 
    id: 'ba-hair', 
    category: 'Hair', 
    icon: 'scissors', 
    label: 'Hair Color & Style Transformation',
    // Replace with your Google Drive image URL: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
    beforeImage: simplehair,
    afterImage: hairColorImage,
  },
  { 
    id: 'ba-skin', 
    category: 'Skin', 
    icon: 'leaf', 
    label: 'Facial Treatment Glow-Up',
    beforeImage: simpleface,
    afterImage: facialImage,
  },
  { 
    id: 'ba-makeup', 
    category: 'Makeup', 
    icon: 'lipstick', 
    label: 'Bridal Makeup Transformation',
    beforeImage: simpleface,
    afterImage: bridalMakeupImage,
  },
  { 
    id: 'ba-mehendi', 
    category: 'Mehendi', 
    icon: 'henna', 
    label: 'Mehendi Depth & Stain Development',
    beforeImage: simplehand,
    afterImage: mehendiImage
  },
];

export function getAllBeforeAfter() {
  return getItem('beforeAfter', DEFAULT_BEFORE_AFTER);
}
