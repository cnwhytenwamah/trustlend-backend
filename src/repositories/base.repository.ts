import {
  Model,
  ModelStatic,
  WhereOptions,
  FindOptions,
  CreationAttributes,
  Attributes,
} from 'sequelize';

/**
 * Generic Sequelize repository. Every entity-specific repository
 * (UserRepository, EquipmentRepository, BookingRepository, ...) extends
 * this instead of re-writing the same CRUD boilerplate.
 *
 * Repositories are the ONLY layer allowed to talk to Sequelize models
 * directly. Services call repositories; they never import a model.
 *
 * Example of extending it:
 *
 *   export class EquipmentRepository extends BaseRepository<Equipment> {
 *     constructor() { super(Equipment); }
 *
 *     // add equipment-specific queries here, e.g.:
 *     findNearby(lat: number, lng: number, radiusKm: number) { ... }
 *   }
 */
export class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findById(id: string, options: FindOptions<Attributes<T>> = {}): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async findOne(where: WhereOptions<Attributes<T>>, options: FindOptions<Attributes<T>> = {}): Promise<T | null> {
    return this.model.findOne({ where, ...options });
  }

  async findAll(options: FindOptions<Attributes<T>> = {}): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findAndCountAll(
    options: FindOptions<Attributes<T>> = {},
  ): Promise<{ rows: T[]; count: number }> {
    return this.model.findAndCountAll(options);
  }

  async create(data: CreationAttributes<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: Partial<Attributes<T>>): Promise<T | null> {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: { id } as unknown as WhereOptions<Attributes<T>>,
    });
    return deletedCount > 0;
  }

  async count(where: WhereOptions<Attributes<T>> = {}): Promise<number> {
    return this.model.count({ where });
  }
}
