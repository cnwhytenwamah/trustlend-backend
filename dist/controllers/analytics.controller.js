"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.analyticsController = {
    async dashboard(_req, res) {
        const data = await analytics_service_1.analyticsService.dashboard();
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Dashboard summary fetched', data });
    },
    async revenue(req, res) {
        const { from, to } = req.query;
        const data = await analytics_service_1.analyticsService.revenue(from, to);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Revenue analytics fetched', data });
    },
    async bookings(req, res) {
        const { from, to } = req.query;
        const data = await analytics_service_1.analyticsService.bookings(from, to);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking analytics fetched', data });
    },
    async users(req, res) {
        const { from, to } = req.query;
        const data = await analytics_service_1.analyticsService.users(from, to);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'User analytics fetched', data });
    },
    async equipment(req, res) {
        const { limit } = req.query;
        const data = await analytics_service_1.analyticsService.equipment(limit);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Equipment analytics fetched', data });
    },
};
//# sourceMappingURL=analytics.controller.js.map