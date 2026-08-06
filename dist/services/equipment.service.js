"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentService = void 0;
const equipment_repository_1 = require("../repositories/equipment.repository");
const equipmentPhoto_repository_1 = require("../repositories/equipmentPhoto.repository");
const AppError_1 = require("../utils/AppError");
const cloudinary_service_1 = require("./cloudinary.service");
const equipmentRepository = new equipment_repository_1.EquipmentRepository();
const equipmentPhotoRepository = new equipmentPhoto_repository_1.EquipmentPhotoRepository();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.equipmentService = {
    async create(ownerId, input) {
        const equipment = await equipmentRepository.create({
            ownerId,
            title: input.title,
            description: input.description,
            category: input.category,
            brand: input.brand ?? null,
            model: input.model ?? null,
            condition: input.condition ?? null,
            dailyRate: input.dailyRate,
            weeklyRate: input.weeklyRate ?? null,
            securityDepositAmount: input.securityDepositAmount,
            address: input.address ?? null,
            latitude: input.latitude ?? null,
            longitude: input.longitude ?? null,
            status: "draft",
        });
        return equipment;
    },
    async listEquipment() {
        return equipmentRepository.findAll();
    },
    async listMyEquipment(ownerId) {
        return equipmentRepository.findByOwnerId(ownerId);
    },
    async getAllEquipment() {
        return equipmentRepository.findAllEquipment();
    },
    async approveEquipment(id) {
        return equipmentRepository.approveEquipment(id);
    },
    async rejectEquipment(id) {
        return equipmentRepository.rejectEquipment(id);
    },
    async adminDeleteEquipment(id) {
        return equipmentRepository.adminDeleteEquipment(id);
    },
    async getById(id) {
        if (!uuidRegex.test(id)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        const equipment = await equipmentRepository.findById(id);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        return equipment;
    },
    async update(ownerId, id, input) {
        if (!uuidRegex.test(id)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        const equipment = await equipmentRepository.findById(id);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        if (equipment.ownerId !== ownerId) {
            throw AppError_1.AppError.forbidden("You are not allowed to update this equipment");
        }
        return equipmentRepository.updateById(id, input);
    },
    async delete(ownerId, id) {
        if (!uuidRegex.test(id)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        const equipment = await equipmentRepository.findById(id);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        if (equipment.ownerId !== ownerId) {
            throw AppError_1.AppError.forbidden("You are not allowed to delete this equipment");
        }
        await equipmentRepository.deleteById(id);
        return {
            message: "Equipment deleted successfully",
        };
    },
    async addPhotos(ownerId, equipmentId, files) {
        if (!uuidRegex.test(equipmentId)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        const equipment = await equipmentRepository.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        if (equipment.ownerId !== ownerId) {
            throw AppError_1.AppError.forbidden("You are not allowed to modify this equipment");
        }
        const photoCount = await equipmentPhotoRepository.countByEquipmentId(equipmentId);
        const photos = [];
        for (let i = 0; i < files.length; i++) {
            const uploaded = await cloudinary_service_1.cloudinaryService.uploadImage(files[i]);
            const photo = await equipmentPhotoRepository.createPhoto({
                equipmentId,
                url: uploaded.url,
                cloudinaryPublicId: uploaded.publicId,
                isPrimary: photoCount === 0 && i === 0,
                sortOrder: photoCount + i,
            });
            photos.push(photo);
        }
        return photos;
    },
    async deletePhoto(ownerId, equipmentId, photoId) {
        if (!uuidRegex.test(equipmentId)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        if (!uuidRegex.test(photoId)) {
            throw AppError_1.AppError.badRequest("Invalid photo ID");
        }
        const equipment = await equipmentRepository.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        if (equipment.ownerId !== ownerId) {
            throw AppError_1.AppError.forbidden("You are not allowed to modify this equipment");
        }
        const photo = await equipmentPhotoRepository.findById(photoId);
        if (!photo) {
            throw AppError_1.AppError.notFound("Photo not found");
        }
        if (photo.equipmentId !== equipmentId) {
            throw AppError_1.AppError.badRequest("Photo does not belong to this equipment");
        }
        const wasPrimary = photo.isPrimary;
        await cloudinary_service_1.cloudinaryService.deleteImage(photo.cloudinaryPublicId);
        await equipmentPhotoRepository.deleteById(photoId);
        if (wasPrimary) {
            const remainingPhotos = await equipmentPhotoRepository.findByEquipmentId(equipmentId);
            if (remainingPhotos.length > 0) {
                await equipmentPhotoRepository.setPrimary(remainingPhotos[0].id);
            }
        }
        return {
            message: "Photo deleted successfully",
        };
    },
    async setPrimaryPhoto(ownerId, equipmentId, photoId) {
        if (!uuidRegex.test(equipmentId)) {
            throw AppError_1.AppError.badRequest("Invalid equipment ID");
        }
        if (!uuidRegex.test(photoId)) {
            throw AppError_1.AppError.badRequest("Invalid photo ID");
        }
        const equipment = await equipmentRepository.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound("Equipment not found");
        }
        if (equipment.ownerId !== ownerId) {
            throw AppError_1.AppError.forbidden("You are not allowed to modify this equipment");
        }
        const photo = await equipmentPhotoRepository.findById(photoId);
        if (!photo) {
            throw AppError_1.AppError.notFound("Photo not found");
        }
        if (photo.equipmentId !== equipmentId) {
            throw AppError_1.AppError.badRequest("Photo does not belong to this equipment");
        }
        // Remove primary flag from every photo
        await equipmentPhotoRepository.clearPrimary(equipmentId);
        // Set selected photo as primary
        await equipmentPhotoRepository.setPrimary(photoId);
        // Fetch the updated photo
        const updatedPhoto = await equipmentPhotoRepository.findById(photoId);
        if (!updatedPhoto) {
            throw AppError_1.AppError.notFound("Photo not found");
        }
        return updatedPhoto;
    },
};
//# sourceMappingURL=equipment.service.js.map