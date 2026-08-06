import { Earning } from "../models";
import { BaseRepository } from "./base.repository";

export class EarningRepository extends BaseRepository<Earning> {
  constructor() {
    super(Earning);
  }

  async findByOwnerId(ownerId: string, limit: number, offset: number) {
    return this.model.findAndCountAll({
      where: { ownerId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  async findPendingByBookingId(bookingId: string) {
    return this.model.findOne({ where: { bookingId, status: "pending" } });
  }

  async sumByOwnerAndStatus(ownerId: string, status: string): Promise<number> {
    const total = await this.model.sum("netAmount", { where: { ownerId, status } });
    return total ?? 0;
  }

  async sumGrossByOwner(ownerId: string): Promise<number> {
    const total = await this.model.sum("grossAmount", { where: { ownerId } });
    return total ?? 0;
  }

  async sumNetByOwner(ownerId: string): Promise<number> {
    const total = await this.model.sum("netAmount", { where: { ownerId } });
    return total ?? 0;
  }
}
