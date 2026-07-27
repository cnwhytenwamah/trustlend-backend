import { DisputeRepository } from "../repositories/dispute.repository";

const disputeRepository = new DisputeRepository();

class DisputeService {
  async createDispute() {
    return {};
  }

  async getMyDisputes(raisedById: string) {
    return disputeRepository.findByRaisedById(raisedById);
  }

  async getAllDisputes() {
    return disputeRepository.findAll();
  }

  async getDisputeById(id: string) {
    return disputeRepository.findById(id);
  }

  async resolveDispute(id: string) {
    return disputeRepository.update(id, {
      status: "resolved",
      resolvedAt: new Date(),
    });
  }

  async closeDispute(id: string) {
    return disputeRepository.update(id, {
      status: "closed",
    });
  }
}

export const disputeService = new DisputeService();