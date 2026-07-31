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
            "isIdentityVerified",
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


async findAllEquipment() {
  return this.model.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async approveEquipment(id: string) {
  return this.update(id,{
    status: "approved",
  } as never);
}

async rejectEquipment(id: string) {
  return this.update(id,{
    status: "rejected",
  } as never);
}

async adminDeleteEquipment(id: string) {
  return this.delete(id);
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
            "isIdentityVerified",
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
