import { Equipment } from "../models";
import { BaseRepository } from "./base.repository";

export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor() {
    super(Equipment);
  }

  async findByOwnerId(ownerId: string) {
    return this.model.findAll({
      where: {
        ownerId,
      },
      order: [["createdAt", "DESC"]],
    });
  }
}