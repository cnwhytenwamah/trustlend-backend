import { Request, Response} from "express";
import { equipmentService } from "../services/equipment.service";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const equipmentController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const equipment = await equipmentService.create(
      req.user.userId,
      req.body
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Equipment created successfully",
      data: equipment,
    });
  },

  async listEquipment(_req: Request, res: Response) {
    const equipment = await equipmentService.listEquipment();

    return sendSuccess(res, {
      message: "Equipment retrieved successfully",
      data: equipment,
    });
  },

  async myListings(req: Request, res: Response) {
  if (!req.user) {
    throw AppError.unauthorized("Authentication required");
  }

  console.log("equipmentService:", Object.keys(equipmentService));

  const equipment = await equipmentService.listMyEquipment(
    req.user.userId
  );

  return sendSuccess(res, {
    message: "Your equipment retrieved successfully",
    data: equipment,
  });
},

async getAllEquipment(_req: Request, res: Response) {
  const equipment = await equipmentService.getAllEquipment();

  return sendSuccess(res, {
    message: "Equipment retrieved successfully",
    data: equipment,
  });
},

async approveEquipment(req: Request, res: Response) {
  const equipment = await equipmentService.approveEquipment(req.params.id as string);

  return sendSuccess(res, {
    message: "Equipment approved successfully",
    data: equipment,
  });
},

async rejectEquipment(req: Request, res: Response) {
  const equipment = await equipmentService.rejectEquipment(req.params.id as string);

  return sendSuccess(res, {
    message: "Equipment rejected successfully",
    data: equipment,
  });
},

async adminDeleteEquipment(req: Request, res: Response) {
  await equipmentService.adminDeleteEquipment(req.params.id as string);

  return sendSuccess(res, {
    message: "Equipment deleted successfully",
  });
},
}

