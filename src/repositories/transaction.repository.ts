import { Transaction } from "../models";
import { BaseRepository } from "./base.repository";

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(Transaction);
  }

  async findByUserId(userId: string) {
    return this.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  async findAndCountByUserId(userId: string, limit: number, offset: number, type?: string) {
    return this.findAndCountAll({
      where: type ? { userId, type } : { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }
}
