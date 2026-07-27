import { id } from "zod/v4/locales";
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


async findAllEquipment() {
  return this.findAll({
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
}