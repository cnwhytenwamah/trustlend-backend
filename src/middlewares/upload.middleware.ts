import multer from 'multer';
import { AppError } from '../utils/AppError';

/**
 * Holds uploaded files in memory as a Buffer so they can be streamed
 * straight to Cloudinary without touching disk. Used for equipment
 * photos, profile photos, verification documents, and issue/damage
 * claim evidence photos.
 */
const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, or WEBP images are allowed', 400) as unknown as null);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
});
