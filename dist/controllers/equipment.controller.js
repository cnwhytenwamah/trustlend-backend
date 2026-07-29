"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentController = void 0;
const equipment_service_1 = require("../services/equipment.service");
const apiResponse_1 = require("../utils/apiResponse");
const AppError_1 = require("../utils/AppError");
exports.equipmentController = {
    async create(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const equipment = await equipment_service_1.equipmentService.create(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            statusCode: 201,
            message: "Equipment created successfully",
            data: equipment,
        });
    },
    async listEquipment(_req, res) {
        const equipment = await equipment_service_1.equipmentService.listEquipment();
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Equipment retrieved successfully",
            data: equipment,
        });
    },
    async myListings(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const equipment = await equipment_service_1.equipmentService.listMyEquipment(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Your equipment retrieved successfully",
            data: equipment,
        });
    },
    async getById(req, res) {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const equipment = await equipment_service_1.equipmentService.getById(id);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Equipment retrieved successfully",
            data: equipment,
        });
    },
    async update(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const equipment = await equipment_service_1.equipmentService.update(req.user.userId, id, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Equipment updated successfully",
            data: equipment,
        });
    },
    async delete(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const result = await equipment_service_1.equipmentService.delete(req.user.userId, id);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: result.message,
        });
    },
    async addPhotos(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const equipmentId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const files = req.files;
        if (!files || files.length === 0) {
            throw AppError_1.AppError.badRequest("Please upload at least one photo");
        }
        const photos = await equipment_service_1.equipmentService.addPhotos(req.user.userId, equipmentId, files);
        return (0, apiResponse_1.sendSuccess)(res, {
            statusCode: 201,
            message: "Equipment photos uploaded successfully",
            data: photos,
        });
    },
    async deletePhoto(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const equipmentId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const photoId = Array.isArray(req.params.photoId)
            ? req.params.photoId[0]
            : req.params.photoId;
        const result = await equipment_service_1.equipmentService.deletePhoto(req.user.userId, equipmentId, photoId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: result.message,
        });
    },
    async setPrimaryPhoto(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const equipmentId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const photoId = Array.isArray(req.params.photoId)
            ? req.params.photoId[0]
            : req.params.photoId;
        const photo = await equipment_service_1.equipmentService.setPrimaryPhoto(req.user.userId, equipmentId, photoId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Primary photo updated successfully",
            data: photo,
        });
    },
};
//# sourceMappingURL=equipment.controller.js.map