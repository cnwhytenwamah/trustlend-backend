"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.damageClaimController = void 0;
const damageClaim_service_1 = require("../services/damageClaim.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.damageClaimController = {
    async create(req, res) {
        const files = req.files ?? [];
        const claim = await damageClaim_service_1.damageClaimService.create(req.user.userId, req.body, files);
        return (0, apiResponse_1.sendSuccess)(res, { statusCode: 201, message: 'Damage claim filed', data: claim });
    },
    async myClaims(req, res) {
        const { page, limit } = req.query;
        const result = await damageClaim_service_1.damageClaimService.myClaims(req.user.userId, page, limit);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Damage claims fetched',
            data: result.claims,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    },
    async adminList(req, res) {
        const { status, page, limit } = req.query;
        const result = await damageClaim_service_1.damageClaimService.adminList({ status, page, limit });
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Damage claims fetched',
            data: result.claims,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    },
    async approve(req, res) {
        const claim = await damageClaim_service_1.damageClaimService.approve(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Damage claim approved', data: claim });
    },
    async reject(req, res) {
        const claim = await damageClaim_service_1.damageClaimService.reject(req.params.id, req.body.reason);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Damage claim rejected', data: claim });
    },
};
//# sourceMappingURL=damageClaim.controller.js.map