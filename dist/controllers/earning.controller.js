"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.earningController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const earning_service_1 = require("../services/earning.service");
class EarningController {
    async getEarnings(req, res) {
        const result = await earning_service_1.earningService.getEarnings();
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Earnings retrieved successfully",
            data: result,
        });
    }
    async getEarningsSummary(req, res) {
        const result = await earning_service_1.earningService.getEarningsSummary();
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Earnings summary retrieved successfully",
            data: result,
        });
    }
    async getEarningTransactions(req, res) {
        const result = await earning_service_1.earningService.getEarningTransactions();
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Earning transactions retrieved successfully",
            data: result,
        });
    }
}
exports.earningController = new EarningController();
//# sourceMappingURL=earning.controller.js.map