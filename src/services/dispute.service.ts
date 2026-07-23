class DisputeService {
  async createDispute() {
    return {};
  }

  async getMyDisputes() {
    return [];
  }

  async getAllDisputes() {
    return [];
  }

  async getDisputeById(id: string) {
    return { id };
  }

  async resolveDispute(id: string) {
    return { id };
  }

  async closeDispute(id: string) {
    return { id };
  }
}

export const disputeService = new DisputeService();