import { VerificationRepository } from '../repositories/verification.repository';
import { AppError } from '../utils/AppError';
import {
  CreateVerificationInput,
  UpdateVerificationInput,
} from '../validators/verification.validator';

const verificationRepository = new VerificationRepository();

export const verificationService = {
  async create(userId: string, input: CreateVerificationInput) {
    const existing = await verificationRepository.findByUserId(userId);

    if (existing) {
      throw AppError.badRequest('Verification already submitted');
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

  async getMyVerification(userId: string) {
    const verification = await verificationRepository.findByUserId(userId);

    if (!verification) {
      throw AppError.notFound('Verification not found');
    }

    return verification;
  },

  async updateMyVerification(
    userId: string,
    input: UpdateVerificationInput
  ) {
    const verification = await verificationRepository.findByUserId(userId);

    if (!verification) {
      throw AppError.notFound('Verification not found');
    }

    if (verification.status === 'approved') {
      throw AppError.badRequest(
        'Approved verification cannot be updated'
      );
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

  async approve(id: string, adminId: string) {
    const verification = await verificationRepository.findById(id);

    if (!verification) {
      throw AppError.notFound('Verification not found');
    }

    return verificationRepository.updateById(id, {
      status: 'approved',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: null,
    });
  },

  async reject(
    id: string,
    adminId: string,
    rejectionReason: string
  ) {
    const verification = await verificationRepository.findById(id);

    if (!verification) {
      throw AppError.notFound('Verification not found');
    }

    return verificationRepository.updateById(id, {
      status: 'rejected',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason,
    });
  },
};