import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { UpdateProfileInput } from '../validators/user.validator';
import cloudinary from '../config/cloudinary';

const userRepository = new UserRepository();

export const userService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return user;
  },

  async getPublicProfile(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound('User not found');
    // Public profile only — trim down to what other users should see.
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      createdAt: user.createdAt,
    };
  },

  async updateMe(userId: string, input: UpdateProfileInput) {
    const updated = await userRepository.update(userId, input as never);
    if (!updated) throw AppError.notFound('User not found');
    return updated;
  },

  async updateProfilePhoto(userId: string, fileBuffer: Buffer) {
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'rentit/profile-photos', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      stream.end(fileBuffer);
    });

    const updated = await userRepository.update(userId, {
      profilePhotoUrl: uploadResult.secure_url,
    } as never);
    if (!updated) throw AppError.notFound('User not found');
    return updated;
  },

  async deleteMe(userId: string) {
    // Soft delete preferred over hard delete — keeps FK integrity with
    // bookings/reviews/etc. intact for historical records.
    const updated = await userRepository.update(userId, { status: 'deleted' } as never);
    if (!updated) throw AppError.notFound('User not found');
  },
};