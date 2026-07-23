class EquipmentService {
  async createEquipment() {
    return {};
  }

  async getEquipment() {
    return [];
  }

  async getMyEquipment() {
    return [];
  }

  async getEquipmentById(id: string) {
    return { id };
  }

  async updateEquipment(id: string) {
    return { id };
  }

  async deleteEquipment(id: string) {
    return { id };
  }

  async addPhotos(id: string) {
    return { id };
  }

  async deletePhoto(id: string, photoId: string) {
    return { id, photoId };
  }

  async setPrimaryPhoto(id: string, photoId: string) {
    return { id, photoId };
  }

  async getAvailability(id: string) {
    return { id };
  }

  async updateAvailability(id: string) {
    return { id };
  }

  async blockDates(id: string) {
    return { id };
  }

  async unblockDates(id: string, blockId: string) {
    return { id, blockId };
  }

  async getAllEquipment() {
    return [];
  }

  async approveEquipment(id: string) {
    return { id };
  }

  async rejectEquipment(id: string) {
    return { id };
  }

  async adminDeleteEquipment(id: string) {
    return { id };
  }
}

export const equipmentService = new EquipmentService();