import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { refundService } from "../services/refund.service";

class RefundController {
    async getRefunds(req: Request, res: Response) {
        const result = await refundService.getRefunds();

        return sendSuccess(res,{
            message: "Refunds retrieved successfully",
            data: result,
        });
    }

    async approveRefund(req: Request, res: Response) {
        const result = await refundService.approveRefund(req.params.id as string);

        return sendSuccess(res,{
            message: "Refund approved successfully",
            data: result,
        });
    }

    async rejectRefund(req: Request, res: Response) {
        const result = await refundService.rejectRefund(req.params.id as string);

        return sendSuccess(res, {
            message: "Refund rejected successfully",
            data: result,
        });
    }
}

export const refundController = new RefundController();