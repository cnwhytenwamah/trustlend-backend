"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const verification_repository_1 = require("../repositories/verification.repository");
const AppError_1 = require("../utils/AppError");
const verificationRepository = new verification_repository_1.VerificationRepository();
exports.verificationService = {
    async create(userId, input) {
        const existing = await verificationRepository.findByUserId(userId);
        if (existing) {
            throw AppError_1.AppError.badRequest('Verification already submitted');
        }
        return verificationRepository.create({
            userId,
            documentType: input.documentType,
            documentUrl: input.documentUrl,
            selfieUrl: input.selfieUrl ?? null,
            status: 'pending',
            rejectionReason: null,
            reviewedBy: null,
            reviewedAt: null,
        });
    },
    async getMyVerification(userId) {
        const verification = await verificationRepository.findByUserId(userId);
        if (!verification) {
            throw AppError_1.AppError.notFound('Verification not found');
        }
        return verification;
    },
    async updateMyVerification(userId, input) {
        const verification = await verificationRepository.findByUserId(userId);
        if (!verification) {
            throw AppError_1.AppError.notFound('Verification not found');
        }
        if (verification.status === 'approved') {
            throw AppError_1.AppError.badRequest('Approved verification cannot be updated');
        }
        await verification.update({
            ...input,
            status: 'pending',
            rejectionReason: null,
            reviewedBy: null,
            reviewedAt: null,
        });
        return verification;
    },
    async listAll() {
        return verificationRepository.findAllPending();
    },
    async approve(id, adminId) {
        const verification = await verificationRepository.findById(id);
        if (!verification) {
            throw AppError_1.AppError.notFound('Verification not found');
        }
        return verificationRepository.updateById(id, {
            status: 'approved',
            reviewedBy: adminId,
            reviewedAt: new Date(),
            rejectionReason: null,
        });
    },
    async reject(id, adminId, rejectionReason) {
        const verification = await verificationRepository.findById(id);
        if (!verification) {
            throw AppError_1.AppError.notFound('Verification not found');
        }
        return verificationRepository.updateById(id, {
            status: 'rejected',
            reviewedBy: adminId,
            reviewedAt: new Date(),
            rejectionReason,
        });
    },
};
//# sourceMappingURL=verification.service.js.map