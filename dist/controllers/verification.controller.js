"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationController = void 0;
const verification_service_1 = require("../services/verification.service");
exports.verificationController = {
    async create(req, res) {
        const verification = await verification_service_1.verificationService.create(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Verification submitted successfully',
            data: verification,
        });
    },
    async me(req, res) {
        const verification = await verification_service_1.verificationService.getMyVerification(req.user.userId);
        res.json({
            success: true,
            message: 'Verification retrieved successfully',
            data: verification,
        });
    },
    async update(req, res) {
        const verification = await verification_service_1.verificationService.updateMyVerification(req.user.userId, req.body);
        res.json({
            success: true,
            message: 'Verification updated successfully',
            data: verification,
        });
    },
    async list(req, res) {
        const verifications = await verification_service_1.verificationService.listAll();
        res.json({
            success: true,
            message: 'Verifications retrieved successfully',
            data: verifications,
        });
    },
    async approve(req, res) {
        const verification = await verification_service_1.verificationService.approve(req.params.id, req.user.userId);
        res.json({
            success: true,
            message: 'Verification approved successfully',
            data: verification,
        });
    },
    async reject(req, res) {
        const verification = await verification_service_1.verificationService.reject(req.params.id, req.user.userId, req.body.rejectionReason);
        res.json({
            success: true,
            message: 'Verification rejected successfully',
            data: verification,
        });
    },
};
//# sourceMappingURL=verification.controller.js.map