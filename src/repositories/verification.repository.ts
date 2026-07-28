import { Verification } from "../models";
import { BaseRepository } from "./base.repository";

export class VerificationRepository extends BaseRepository<Verification> {
  constructor() {
    super(Verification);
  }

  async findByUserId(userId: string) {
    return this.model.findOne({
      where: {
        userId,
      },
    });
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async updateById(
    id: string,
    data: Partial<Verification>
  ) {
    const verification = await this.model.findByPk(id);

    if (!verification) {
      return null;
    }

    await verification.update(data);

    return verification;
  }

  async findAllPending() {
    return this.model.findAll({
      order: [["createdAt", "DESC"]],
    });
  }
}