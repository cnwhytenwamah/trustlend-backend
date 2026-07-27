import { RefundRepository } from "../repositories/refund.repository";

const refundRepository = new RefundRepository();

class RefundService {
    async getRefunds() {
        return refundRepository.findAll();
    }

    async approveRefund(id: string) {
        return refundRepository.update(id, {
            status: "processed",
            processedAt: new Date(),
        });
    }

    async rejectRefund(id: string) {
        return refundRepository.update(id, {
            status: "rejected",
        });
    }
}

export const refundService = new RefundService();
