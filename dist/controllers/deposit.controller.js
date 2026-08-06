"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositController = void 0;
const deposit_service_1 = require("../services/deposit.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.depositController = {
    async myDeposits(req, res) {
        const { page, limit } = req.query;
        const result = await deposit_service_1.depositService.myDeposits(req.user.userId, page, limit);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Deposits fetched',
            data: result.deposits,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    },
    async getById(req, res) {
        const deposit = await deposit_service_1.depositService.getById(req.user.userId, req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Deposit fetched', data: deposit });
    },
    async hold(req, res) {
        const deposit = await deposit_service_1.depositService.hold(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Deposit held', data: deposit });
    },
    async release(req, res) {
        const refund = await deposit_service_1.depositService.release(req.user.userId, req.user.role, req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Deposit released — refund to the renter has been queued',
            data: refund,
        });
    },
    async refund(req, res) {
        const refund = await deposit_service_1.depositService.refund(req.params.id, req.body.reason);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Deposit refund initiated', data: refund });
    },
};
//# sourceMappingURL=deposit.controller.js.map