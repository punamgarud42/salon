import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { uploadImage, uploadVideo } from '../controllers/uploads.controller.js';

/**
 * memoryStorage keeps the uploaded file in RAM as req.file.buffer instead
 * of writing it to disk — important on Render's free tier where the
 * filesystem resets on every deploy.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB — covers typical salon video clips
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, GIF images and MP4/MOV/WebM videos are accepted.'));
    }
  },
});

const router = Router();

// POST /api/uploads/image — admin only, single image
router.post('/image', requireAdmin, upload.single('image'), uploadImage);

// POST /api/uploads/video — admin only, single video
router.post('/video', requireAdmin, upload.single('video'), uploadVideo);

export default router;
