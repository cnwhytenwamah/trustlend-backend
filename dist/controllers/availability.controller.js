"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityController = void 0;
const availability_service_1 = require("../services/availability.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.availabilityController = {
    async getAvailability(req, res) {
        const equipmentId = req.params.id;
        const result = await availability_service_1.availabilityService.getAvailability(equipmentId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Availability fetched successfully',
            data: result,
        });
    },
    async updateAvailability(req, res) {
        const equipmentId = req.params.id;
        const result = await availability_service_1.availabilityService.updateAvailability(equipmentId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Availability updated successfully',
            data: result,
        });
    },
    async blockDates(req, res) {
        const equipmentId = req.params.id;
        const result = await availability_service_1.availabilityService.blockDates(equipmentId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Dates blocked successfully',
            data: result,
        });
    },
    async deleteBlock(req, res) {
        const equipmentId = req.params.id;
        const blockId = req.params.blockId;
        const result = await availability_service_1.availabilityService.deleteBlock(equipmentId, blockId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Blocked date removed successfully',
            data: result,
        });
    },
};
//# sourceMappingURL=availability.controller.js.map