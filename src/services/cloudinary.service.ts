import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  async uploadImage(file: Express.Multer.File) {
    return new Promise<{
      url: string;
      publicId: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "trustlend/equipment",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary upload failed"));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  },

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  },
};