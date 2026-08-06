"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.paymentController = {
    async initialize(req, res) {
        const result = await payment_service_1.paymentService.initialize(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, { statusCode: 201, message: 'Payment initialized', data: result });
    },
    async webhook(req, res) {
        const signature = req.headers['x-paystack-signature'];
        await payment_service_1.paymentService.handleWebhook(req.body, signature);
        // Paystack just needs a fast 2xx acknowledgment — no body required.
        res.sendStatus(200);
    },
    async getById(req, res) {
        const payment = await payment_service_1.paymentService.getById(req.user.userId, req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Payment fetched', data: payment });
    },
    async myPayments(req, res) {
        const { page, limit } = req.query;
        const result = await payment_service_1.paymentService.myPayments(req.user.userId, page, limit);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Payments fetched',
            data: result.payments,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    },
    async refund(req, res) {
        const refund = await payment_service_1.paymentService.requestRefund(req.user.userId, req.params.id, req.body.reason);
        return (0, apiResponse_1.sendSuccess)(res, { statusCode: 201, message: 'Refund requested', data: refund });
    },
};
//# sourceMappingURL=payment.controller.js.map