import { Equipment } from "../models";
import { BaseRepository } from "./base.repository";

export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor() {
    super(Equipment);
  }

  async findAll() {
    return this.model.findAll({
      where: {
        status: "active",
      },

      include: [
        {
          association: "photos",
          attributes: [
            "id",
            "url",
            "isPrimary",
            "sortOrder",
          ],
          where: {
            isPrimary: true,
          },
          required: false,
        },

        {
          association: "owner",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profilePhotoUrl",
          ],
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],
    });
  }

  async findByOwnerId(ownerId: string) {
    return this.model.findAll({
      where: {
        ownerId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: string) {
    return this.model.findByPk(id, {
      include: [
        {
          association: "photos",
          attributes: [
            "id",
            "url",
            "isPrimary",
            "sortOrder",
          ],
          order: [
            ["sortOrder", "ASC"],
          ],
        },

        {
          association: "owner",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profilePhotoUrl",
          ],
        },
      ],
    });
  }

  async updateById(id: string, data: Partial<Equipment>) {
    const equipment = await this.model.findByPk(id);

    if (!equipment) {
      return null;
    }

    await equipment.update(data);

    return equipment;
  }

  async deleteById(id: string) {
    const equipment = await this.model.findByPk(id);

    if (!equipment) {
      return null;
    }

    await equipment.destroy();

    return true;
  }
}