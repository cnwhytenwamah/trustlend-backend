import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { disputeService } from "../services/dispute.service";
import { AppError } from "../utils/AppError";

class DisputeController {
    async createDispute(req: Request, res: Response) {
        const result = await disputeService.createDispute();

        return sendSuccess(res, {
            message: "Dispute created successfully",
            data: result,
        });
    }

    async getMyDisputes(req: Request, res: Response) {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required");
      }

      const result = await disputeService.getMyDisputes(
        req.user.userId
      );

      return sendSuccess(res, {
         message: "Disputes retrieved successfully",
         data: result,
      });
   }

    async getAllDisputes(req: Request, res: Response) {
        const result = await disputeService.getAllDisputes();

        return sendSuccess(res, {
            message: "Disputes retrieved successfully",
            data: result,
        });
    }

    async getDisputeById(req: Request, res: Response) {
        const result = await disputeService.getDisputeById(req.params.id as string);

        return sendSuccess(res, {
            message: "Dispute retrieved successfully",
            data: result,
        });
    }

    async resolveDispute(req: Request, res: Response) {
        const result = await disputeService.resolveDispute(req.params.id as string);

        return sendSuccess(res,{
            message: "Dispute resolved successfully",
            data: result,
        });
    }

    async closeDispute(req: Request, res: Response) {
        const result = await disputeService.closeDispute(req.params.id as string);

        return sendSuccess(res, {
            message: " Dispute closed successfully",
            data: result,
        });
    }
}

export const disputeController = new DisputeController();