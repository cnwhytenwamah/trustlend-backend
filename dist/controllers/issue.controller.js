"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueController = void 0;
const issue_service_1 = require("../services/issue.service");
const apiResponse_1 = require("../utils/apiResponse");
const AppError_1 = require("../utils/AppError");
exports.issueController = {
    async create(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const issue = await issue_service_1.issueService.create(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            statusCode: 201,
            message: "Issue reported successfully",
            data: issue,
        });
    },
    async myIssues(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const issues = await issue_service_1.issueService.listMyIssues(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Your issues retrieved successfully",
            data: issues,
        });
    },
    async getById(req, res) {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const issue = await issue_service_1.issueService.getById(id);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Issue retrieved successfully",
            data: issue,
        });
    },
    async update(req, res) {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized("Authentication required");
        }
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const issue = await issue_service_1.issueService.update(req.user.userId, id, req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Issue updated successfully",
            data: issue,
        });
    },
};
//# sourceMappingURL=issue.controller.js.map