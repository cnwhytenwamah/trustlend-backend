import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { equipmentService } from "../services/equipment.service";

class EquipmentController {
  async createEquipment(req: Request, res: Response) {
    const result = await equipmentService.createEquipment();

    return sendSuccess(res, {
      message: "Equipment created successfully",
      data: result,
    });
  }

  async getEquipment(req: Request, res: Response) {
    const result = await equipmentService.getEquipment();

    return sendSuccess(res, {
      message: "Equipment retrieved successfully",
      data: result,
    });
  }

  async getMyEquipment(req: Request, res: Response) {
    const result = await equipmentService.getMyEquipment();

    return sendSuccess(res, {
      message: "My equipment retrieved successfully",
      data: result,
    });
  }

  async getEquipmentById(req: Request, res: Response) {
    const result = await equipmentService.getEquipmentById(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment retrieved successfully",
      data: result,
    });
  }

  async updateEquipment(req: Request, res: Response) {
    const result = await equipmentService.updateEquipment(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment updated successfully",
      data: result,
    });
  }

  async deleteEquipment(req: Request, res: Response) {
    const result = await equipmentService.deleteEquipment(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment deleted successfully",
      data: result,
    });
  }

    async addPhotos(req: Request, res: Response) {
    const result = await equipmentService.addPhotos(req.params.id as string);

    return sendSuccess(res, {
      message: "Photos added successfully",
      data: result,
    });
  }

  async deletePhoto(req: Request, res: Response) {
    const result = await equipmentService.deletePhoto(
      req.params.id as string,
      req.params.photoId as string,
    );

    return sendSuccess(res, {
      message: "Photo deleted successfully",
      data: result,
    });
  }

  async setPrimaryPhoto(req: Request, res: Response) {
    const result = await equipmentService.setPrimaryPhoto(
      req.params.id as string,
      req.params.photoId as string,
    );

    return sendSuccess(res, {
      message: "Primary photo updated successfully",
      data: result,
    });
  }

  async getAvailability(req: Request, res: Response) {
    const result = await equipmentService.getAvailability(req.params.id as string);

    return sendSuccess(res, {
      message: "Availability retrieved successfully",
      data: result,
    });
  }

  async updateAvailability(req: Request, res: Response) {
    const result = await equipmentService.updateAvailability(req.params.id as string);

    return sendSuccess(res, {
      message: "Availability updated successfully",
      data: result,
    });
  }

  async blockDates(req: Request, res: Response) {
    const result = await equipmentService.blockDates(req.params.id as string);

    return sendSuccess(res, {
      message: "Dates blocked successfully",
      data: result,
    });
  }

  async unblockDates(req: Request, res: Response) {
    const result = await equipmentService.unblockDates(
      req.params.id as string,
      req.params.blockId as string,
    );

    return sendSuccess(res, {
      message: "Dates unblocked successfully",
      data: result,
    });
  }

  async getAllEquipment(req: Request, res: Response) {
    const result = await equipmentService.getAllEquipment();

    return sendSuccess(res, {
      message: "Equipment retrieved successfully",
      data: result,
    });
  }

  async approveEquipment(req: Request, res: Response) {
    const result = await equipmentService.approveEquipment(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment approved successfully",
      data: result,
    });
  }

  async rejectEquipment(req: Request, res: Response) {
    const result = await equipmentService.rejectEquipment(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment rejected successfully",
      data: result,
    });
  }

  async adminDeleteEquipment(req: Request, res: Response) {
    const result = await equipmentService.adminDeleteEquipment(req.params.id as string);

    return sendSuccess(res, {
      message: "Equipment deleted successfully",
      data: result,
    });
  }
}

export const equipmentController = new EquipmentController();