import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

/**
 * Cloudinary is configured from environment variables set on Render:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 * Get these free at cloudinary.com — free tier is 25GB storage/bandwidth,
 * more than enough for a salon. The upload route is admin-only (requireAdmin
 * middleware in uploads.routes.js).
 */
function getCloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

/**
 * POST /api/uploads/image
 * Body: multipart/form-data with field name "image"
 * Returns: { url, publicId, width, height }
 *
 * Uses a stream upload (not a temp file) so nothing is written to disk —
 * Render's free tier filesystem doesn't persist between deploys anyway.
 */
export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file received.' });
  }

  const cld = getCloudinaryConfig();
  if (!cld) {
    return res.status(503).json({
      error: 'Image upload is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the backend environment variables on Render.',
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cld.uploader.upload_stream(
        {
          folder: 'verme-salon/images',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 900, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      type: 'image',
    });
  } catch (err) {
    console.error('[uploads] Cloudinary image upload failed:', err);
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  }
}

/**
 * POST /api/uploads/video
 * Body: multipart/form-data with field name "video"
 * Returns: { url, publicId, duration, type: 'video' }
 *
 * Cloudinary free tier includes 500MB video storage and serves videos
 * optimised for web (auto-quality, proper streaming). Videos are stored
 * in the verme-salon/videos folder in your Cloudinary media library.
 */
export async function uploadVideo(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file received.' });
  }

  const cld = getCloudinaryConfig();
  if (!cld) {
    return res.status(503).json({
      error: 'Video upload is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the backend environment variables on Render.',
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cld.uploader.upload_stream(
        {
          folder: 'verme-salon/videos',
          resource_type: 'video',
          // Cloudinary auto-optimises video for web streaming:
          // generates multiple resolutions, serves the best one per device
          eager: [
            { streaming_profile: 'auto', format: 'mp4' },
          ],
          eager_async: true, // don't wait for transcoding — return the original URL immediately
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      thumbnail: result.secure_url.replace('/upload/', '/upload/so_0,f_jpg,w_640/'),
      type: 'video',
    });
  } catch (err) {
    console.error('[uploads] Cloudinary video upload failed:', err);
    res.status(500).json({ error: 'Video upload failed. Please try again.' });
  }
}
