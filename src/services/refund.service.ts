class RefundService {
    async getRefunds() {
        return[];
    }

    async approveRefund(id: string) {
        return { id };
    }

    async rejectRefund(id: string) {
        return { id };
    }
}

export const refundService = new RefundService();
