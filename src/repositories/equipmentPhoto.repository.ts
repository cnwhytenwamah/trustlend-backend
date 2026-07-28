import { EquipmentPhoto } from "../models";
import { BaseRepository } from "./base.repository";

export class EquipmentPhotoRepository extends BaseRepository<EquipmentPhoto> {
  constructor() {
    super(EquipmentPhoto);
  }

  async countByEquipmentId(equipmentId: string) {
    return this.model.count({
      where: {
        equipmentId,
      },
    });
  }

  async createPhoto(data: Partial<EquipmentPhoto>) {
    return this.model.create(data as never);
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async findByEquipmentId(equipmentId: string) {
    return this.model.findAll({
      where: {
        equipmentId,
      },
      order: [["sortOrder", "ASC"]],
    });
  }

  async findPrimaryPhoto(equipmentId: string) {
    return this.model.findOne({
      where: {
        equipmentId,
        isPrimary: true,
      },
    });
  }

  async clearPrimary(equipmentId: string) {
    await this.model.update(
      {
        isPrimary: false,
      },
      {
        where: {
          equipmentId,
        },
      }
    );
  }

  async setPrimary(photoId: string) {
    await this.model.update(
      {
        isPrimary: true,
      },
      {
        where: {
          id: photoId,
        },
      }
    );
  }

  async deleteById(id: string) {
    const photo = await this.findById(id);

    if (!photo) {
      return null;
    }

    await photo.destroy();

    return true;
  }
}