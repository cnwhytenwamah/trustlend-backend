import { EquipmentRepository } from "../repositories/equipment.repository";
import { CreateEquipmentInput } from "../validators/equipment.validator";

const equipmentRepository = new EquipmentRepository();

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
};