"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
const apiResponse_1 = require("../utils/apiResponse");
const AppError_1 = require("../utils/AppError");
exports.userController = {
    async getMe(req, res) {
        const user = await user_service_1.userService.getMe(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Profile fetched', data: user });
    },
    async updateMe(req, res) {
        const user = await user_service_1.userService.updateMe(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Profile updated', data: user });
    },
    async updateProfilePhoto(req, res) {
        if (!req.file) {
            throw AppError_1.AppError.badRequest('No photo file provided');
        }
        const user = await user_service_1.userService.updateProfilePhoto(req.user.userId, req.file.buffer);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Profile photo updated', data: user });
    },
    async deleteMe(req, res) {
        await user_service_1.userService.deleteMe(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Account deleted' });
    },
    async getById(req, res) {
        const user = await user_service_1.userService.getPublicProfile(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User fetched', data: user });
    },
};
//# sourceMappingURL=user.controller.js.map