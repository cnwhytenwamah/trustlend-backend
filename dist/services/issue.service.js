"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueService = void 0;
const issue_repository_1 = require("../repositories/issue.repository");
const AppError_1 = require("../utils/AppError");
const issueRepository = new issue_repository_1.IssueRepository();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.issueService = {
    async create(reporterId, input) {
        const issue = await issueRepository.create({
            bookingId: input.bookingId,
            reporterId,
            description: input.description,
            photoUrls: input.photoUrls ?? [],
            status: "open",
            resolutionNotes: null,
        });
        return issue;
    },
    async listMyIssues(reporterId) {
        return issueRepository.findByReporterId(reporterId);
    },
    async getById(id) {
        if (!uuidRegex.test(id)) {
            throw AppError_1.AppError.badRequest("Invalid issue ID");
        }
        const issue = await issueRepository.findById(id);
        if (!issue) {
            throw AppError_1.AppError.notFound("Issue not found");
        }
        return issue;
    },
    async update(reporterId, id, input) {
        if (!uuidRegex.test(id)) {
            throw AppError_1.AppError.badRequest("Invalid issue ID");
        }
        const issue = await issueRepository.findById(id);
        if (!issue) {
            throw AppError_1.AppError.notFound("Issue not found");
        }
        if (issue.reporterId !== reporterId) {
            throw AppError_1.AppError.forbidden("You are not allowed to update this issue");
        }
        return issueRepository.updateById(id, input);
    },
};
//# sourceMappingURL=issue.service.js.map