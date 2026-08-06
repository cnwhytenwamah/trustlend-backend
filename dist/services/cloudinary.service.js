"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
exports.cloudinaryService = {
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: "trustlend/equipment",
            }, (error, result) => {
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
            });
            stream_1.Readable.from(file.buffer).pipe(uploadStream);
        });
    },
    async deleteImage(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    },
};
//# sourceMappingURL=cloudinary.service.js.map