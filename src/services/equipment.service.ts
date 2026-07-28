import { EquipmentRepository } from "../repositories/equipment.repository";
import { EquipmentPhotoRepository } from "../repositories/equipmentPhoto.repository";
import {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from "../validators/equipment.validator";
import { AppError } from "../utils/AppError";
import { cloudinaryService } from "./cloudinary.service";

const equipmentRepository = new EquipmentRepository();
const equipmentPhotoRepository = new EquipmentPhotoRepository();

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const equipmentService = {
  async create(ownerId: string, input: CreateEquipmentInput) {
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
    } as never);

    return equipment;
  },

  async listEquipment() {
    return equipmentRepository.findAll();
  },

  async listMyEquipment(ownerId: string) {
    return equipmentRepository.findByOwnerId(ownerId);
  },

async getAllEquipment() {
  return equipmentRepository.findAllEquipment();
},

async approveEquipment(id: string) {
  return equipmentRepository.approveEquipment(id);
},

async rejectEquipment(id: string) {
  return equipmentRepository.rejectEquipment(id);
},

async adminDeleteEquipment(id: string) {
  return equipmentRepository.adminDeleteEquipment(id)
},

  async getById(id: string) {
    if (!uuidRegex.test(id)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    const equipment = await equipmentRepository.findById(id);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    return equipment;
  },

  async update(
    ownerId: string,
    id: string,
    input: UpdateEquipmentInput
  ) {
    if (!uuidRegex.test(id)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    const equipment = await equipmentRepository.findById(id);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    if (equipment.ownerId !== ownerId) {
      throw AppError.forbidden(
        "You are not allowed to update this equipment"
      );
    }

    return equipmentRepository.updateById(id, input);
  },

  async delete(ownerId: string, id: string) {
    if (!uuidRegex.test(id)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    const equipment = await equipmentRepository.findById(id);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    if (equipment.ownerId !== ownerId) {
      throw AppError.forbidden(
        "You are not allowed to delete this equipment"
      );
    }

    await equipmentRepository.deleteById(id);

    return {
      message: "Equipment deleted successfully",
    };
  },

  async addPhotos(
    ownerId: string,
    equipmentId: string,
    files: Express.Multer.File[]
  ) {
    if (!uuidRegex.test(equipmentId)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    if (equipment.ownerId !== ownerId) {
      throw AppError.forbidden(
        "You are not allowed to modify this equipment"
      );
    }

    const photoCount =
      await equipmentPhotoRepository.countByEquipmentId(equipmentId);

    const photos = [];

    for (let i = 0; i < files.length; i++) {
      const uploaded = await cloudinaryService.uploadImage(files[i]);

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

  async deletePhoto(
    ownerId: string,
    equipmentId: string,
    photoId: string
  ) {
    if (!uuidRegex.test(equipmentId)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    if (!uuidRegex.test(photoId)) {
      throw AppError.badRequest("Invalid photo ID");
    }

    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    if (equipment.ownerId !== ownerId) {
      throw AppError.forbidden(
        "You are not allowed to modify this equipment"
      );
    }

    const photo = await equipmentPhotoRepository.findById(photoId);

    if (!photo) {
      throw AppError.notFound("Photo not found");
    }

    if (photo.equipmentId !== equipmentId) {
      throw AppError.badRequest(
        "Photo does not belong to this equipment"
      );
    }

    const wasPrimary = photo.isPrimary;

    await cloudinaryService.deleteImage(
      photo.cloudinaryPublicId
    );

    await equipmentPhotoRepository.deleteById(photoId);

    if (wasPrimary) {
      const remainingPhotos =
        await equipmentPhotoRepository.findByEquipmentId(
          equipmentId
        );

      if (remainingPhotos.length > 0) {
        await equipmentPhotoRepository.setPrimary(
          remainingPhotos[0].id
        );
      }
    }

    return {
      message: "Photo deleted successfully",
    };
  },

  async setPrimaryPhoto(
    ownerId: string,
    equipmentId: string,
    photoId: string
  ) {
    if (!uuidRegex.test(equipmentId)) {
      throw AppError.badRequest("Invalid equipment ID");
    }

    if (!uuidRegex.test(photoId)) {
      throw AppError.badRequest("Invalid photo ID");
    }

    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    if (equipment.ownerId !== ownerId) {
      throw AppError.forbidden(
        "You are not allowed to modify this equipment"
      );
    }

    const photo = await equipmentPhotoRepository.findById(photoId);

    if (!photo) {
      throw AppError.notFound("Photo not found");
    }

    if (photo.equipmentId !== equipmentId) {
      throw AppError.badRequest(
        "Photo does not belong to this equipment"
      );
    }

    // Remove primary flag from every photo
    await equipmentPhotoRepository.clearPrimary(equipmentId);

    // Set selected photo as primary
    await equipmentPhotoRepository.setPrimary(photoId);

    // Fetch the updated photo
    const updatedPhoto =
      await equipmentPhotoRepository.findById(photoId);

    if (!updatedPhoto) {
      throw AppError.notFound("Photo not found");
    }

    return updatedPhoto;
  },
};
