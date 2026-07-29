"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserController = void 0;
const adminUser_service_1 = require("../services/adminUser.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.adminUserController = {
    async list(req, res) {
        const { status, search, page, limit } = req.query;
        const result = await adminUser_service_1.adminUserService.list({ status, search, page, limit });
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Users fetched',
            data: result.users,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    },
    async getById(req, res) {
        const user = await adminUser_service_1.adminUserService.getById(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User fetched', data: user });
    },
    async updateStatus(req, res) {
        const user = await adminUser_service_1.adminUserService.updateStatus(req.params.id, req.body.status);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User status updated', data: user });
    },
    async verify(req, res) {
        const user = await adminUser_service_1.adminUserService.verify(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User identity verified', data: user });
    },
    async remove(req, res) {
        await adminUser_service_1.adminUserService.delete(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User deleted' });
    },
};
//# sourceMappingURL=adminUser.controller.js.map