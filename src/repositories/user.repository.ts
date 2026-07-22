import { User } from '../models';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  /**
   * Auth flows need the passwordHash, which is excluded by the
   * model's defaultScope — so this explicitly opts back into it.
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return User.scope('withPassword').findOne({ where: { email } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.model.count({ where: { email } });
    return count > 0;
  }
}
