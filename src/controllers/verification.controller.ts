import { Request, Response } from 'express';
import { verificationService } from '../services/verification.service';

export const verificationController = {
  async create(req: Request, res: Response) {
    const verification = await verificationService.create(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'Verification submitted successfully',
      data: verification,
    });
  },

  async me(req: Request, res: Response) {
    const verification = await verificationService.getMyVerification(
      req.user!.userId
    );

    res.json({
      success: true,
      message: 'Verification retrieved successfully',
      data: verification,
    });
  },

  async update(req: Request, res: Response) {
    const verification = await verificationService.updateMyVerification(
      req.user!.userId,
      req.body
    );

    res.json({
      success: true,
      message: 'Verification updated successfully',
      data: verification,
    });
  },

  async list(req: Request, res: Response) {
    const verifications = await verificationService.listAll();

    res.json({
      success: true,
      message: 'Verifications retrieved successfully',
      data: verifications,
    });
  },

  async approve(req: Request, res: Response) {
    const verification = await verificationService.approve(
      req.params.id as string,
      req.user!.userId
    );

    res.json({
      success: true,
      message: 'Verification approved successfully',
      data: verification,
    });
  },

  async reject(req: Request, res: Response) {
    const verification = await verificationService.reject(
      req.params.id as string,
      req.user!.userId,
      req.body.rejectionReason
    );

    res.json({
      success: true,
      message: 'Verification rejected successfully',
      data: verification,
    });
  },
};