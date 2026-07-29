"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_service_1 = require("../services/review.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.reviewController = {
    // POST /reviews
    async create(req, res) {
        const result = await review_service_1.reviewService.createReview(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Review created successfully',
            data: result,
        });
    },
    // GET /reviews/equipment/:equipmentId
    async getEquipmentReviews(req, res) {
        const equipmentId = req.params.equipmentId;
        const result = await review_service_1.reviewService.getEquipmentReviews(equipmentId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Equipment reviews fetched successfully',
            data: result,
        });
    },
    // GET /reviews/user/:userId
    async getUserReviews(req, res) {
        const userId = req.params.userId;
        const result = await review_service_1.reviewService.getUserReviews(userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'User reviews fetched successfully',
            data: result,
        });
    },
    // PATCH /reviews/:id
    async update(req, res) {
        const reviewId = req.params.id;
        const result = await review_service_1.reviewService.updateReview(reviewId, req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Review updated successfully',
            data: result,
        });
    },
    // DELETE /reviews/:id
    async delete(req, res) {
        const reviewId = req.params.id;
        const result = await review_service_1.reviewService.deleteReview(reviewId, req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Review deleted successfully',
            data: result,
        });
    },
};
//# sourceMappingURL=review.controller.js.map