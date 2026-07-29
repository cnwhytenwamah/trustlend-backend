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

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const equipment = await equipmentService.getById(id);

    return sendSuccess(res, {
      message: "Equipment retrieved successfully",
      data: equipment,
    });
  },

  async update(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const equipment = await equipmentService.update(
      req.user.userId,
      id,
      req.body
    );

    return sendSuccess(res, {
      message: "Equipment updated successfully",
      data: equipment,
    });
  },

  async delete(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await equipmentService.delete(
      req.user.userId,
      id
    );

    return sendSuccess(res, {
      message: result.message,
    });
  },

  async addPhotos(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const equipmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw AppError.badRequest("Please upload at least one photo");
    }

    const photos = await equipmentService.addPhotos(
      req.user.userId,
      equipmentId,
      files
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Equipment photos uploaded successfully",
      data: photos,
    });
  },

  async deletePhoto(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const equipmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const photoId = Array.isArray(req.params.photoId)
      ? req.params.photoId[0]
      : req.params.photoId;

    const result = await equipmentService.deletePhoto(
      req.user.userId,
      equipmentId,
      photoId
    );

    return sendSuccess(res, {
      message: result.message,
    });
  },

  async setPrimaryPhoto(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const equipmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const photoId = Array.isArray(req.params.photoId)
      ? req.params.photoId[0]
      : req.params.photoId;

    const photo = await equipmentService.setPrimaryPhoto(
      req.user.userId,
      equipmentId,
      photoId
    );

    return sendSuccess(res, {
      message: "Primary photo updated successfully",
      data: photo,
    });
  },
};

