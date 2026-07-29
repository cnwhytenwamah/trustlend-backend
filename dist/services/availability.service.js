"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityService = void 0;
const equipment_repository_1 = require("../repositories/equipment.repository");
const AppError_1 = require("../utils/AppError");
const equipmentRepo = new equipment_repository_1.EquipmentRepository();
exports.availabilityService = {
    // Get availability for a specific equipment
    async getAvailability(equipmentId) {
        const equipment = await equipmentRepo.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound('Equipment not found');
        }
        // Return availability status (you can expand this with more logic later)
        return {
            equipmentId: equipment.id,
            isAvailable: equipment.status === 'active',
            // You can add more fields here as needed
        };
    },
    // Update availability
    async updateAvailability(equipmentId, data) {
        const equipment = await equipmentRepo.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound('Equipment not found');
        }
        // Update equipment status based on availability
        const updated = await equipmentRepo.update(equipmentId, {
            status: data.isAvailable ? 'active' : 'inactive',
        });
        return updated;
    },
    // Block specific dates (placeholder)
    async blockDates(equipmentId, data) {
        const equipment = await equipmentRepo.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound('Equipment not found');
        }
        // TODO: Implement actual block dates logic with AvailabilityBlock model
        // For now, return a placeholder response
        return {
            message: 'Dates blocked successfully',
            equipmentId,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason || 'No reason provided',
        };
    },
    // Delete a blocked date (placeholder)
    async deleteBlock(equipmentId, blockId) {
        const equipment = await equipmentRepo.findById(equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound('Equipment not found');
        }
        // TODO: Implement actual delete block logic
        return {
            message: 'Blocked date removed successfully',
            equipmentId,
            blockId,
        };
    },
};
//# sourceMappingURL=availability.service.js.map