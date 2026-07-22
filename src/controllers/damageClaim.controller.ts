import { Request, Response } from 'express';
import { damageClaimService } from '../services/damageClaim.service';
import { sendSuccess } from '../utils/apiResponse';

export const damageClaimController = {
  async create(req: Request, res: Response) {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const claim = await damageClaimService.create(req.user!.userId, req.body, files);
    return sendSuccess(res, { statusCode: 201, message: 'Damage claim filed', data: claim });
  },

  async myClaims(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await damageClaimService.myClaims(req.user!.userId, page, limit);
    return sendSuccess(res, {
      message: 'Damage claims fetched',
      data: result.claims,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async adminList(req: Request, res: Response) {
    const { status, page, limit } = req.query as unknown as {
      status?: string;
      page: number;
      limit: number;
    };
    const result = await damageClaimService.adminList({ status, page, limit });
    return sendSuccess(res, {
      message: 'Damage claims fetched',
      data: result.claims,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async approve(req: Request, res: Response) {
    const claim = await damageClaimService.approve(req.params.id as string);
    return sendSuccess(res, { message: 'Damage claim approved', data: claim });
  },

  async reject(req: Request, res: Response) {
    const claim = await damageClaimService.reject(req.params.id as string, req.body.reason);
    return sendSuccess(res, { message: 'Damage claim rejected', data: claim });
  },
};
