"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../utils/AppError");
/**
 * Holds uploaded files in memory as a Buffer so they can be streamed
 * straight to Cloudinary without touching disk. Used for equipment
 * photos, profile photos, verification documents, and issue/damage
 * claim evidence photos.
 */
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
        return cb(new AppError_1.AppError('Only JPEG, PNG, or WEBP images are allowed', 400));
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
    },
});
//# sourceMappingURL=upload.middleware.js.map