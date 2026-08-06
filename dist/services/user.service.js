"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const AppError_1 = require("../utils/AppError");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const userRepository = new user_repository_1.UserRepository();
exports.userService = {
    async getMe(userId) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw AppError_1.AppError.notFound('User not found');
        return user;
    },
    async getPublicProfile(id) {
        const user = await userRepository.findById(id);
        if (!user)
            throw AppError_1.AppError.notFound('User not found');
        // Public profile only — trim down to what other users should see.
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePhotoUrl: user.profilePhotoUrl,
            createdAt: user.createdAt,
        };
    },
    async updateMe(userId, input) {
        const updated = await userRepository.update(userId, input);
        if (!updated)
            throw AppError_1.AppError.notFound('User not found');
        return updated;
    },
    async updateProfilePhoto(userId, fileBuffer) {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({ folder: 'trustlend/profile-photos', resource_type: 'image' }, (error, result) => {
                if (error || !result)
                    return reject(error);
                resolve(result);
            });
            stream.end(fileBuffer);
        });
        const updated = await userRepository.update(userId, {
            profilePhotoUrl: uploadResult.secure_url,
        });
        if (!updated)
            throw AppError_1.AppError.notFound('User not found');
        return updated;
    },
    async deleteMe(userId) {
        // Soft delete preferred over hard delete — keeps FK integrity with
        // bookings/reviews/etc. intact for historical records.
        const updated = await userRepository.update(userId, { status: 'deleted' });
        if (!updated)
            throw AppError_1.AppError.notFound('User not found');
    },
};
//# sourceMappingURL=user.service.js.map