"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class IssueRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Issue);
    }
    async findById(id) {
        return this.model.findByPk(id);
    }
    async findByReporterId(reporterId) {
        return this.model.findAll({
            where: {
                reporterId,
            },
            order: [["createdAt", "DESC"]],
        });
    }
    async updateById(id, data) {
        const issue = await this.model.findByPk(id);
        if (!issue) {
            return null;
        }
        await issue.update(data);
        return issue;
    }
}
exports.IssueRepository = IssueRepository;
//# sourceMappingURL=issue.repository.js.map