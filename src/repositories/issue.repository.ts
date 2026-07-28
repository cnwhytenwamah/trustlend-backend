import { Issue } from "../models";
import { BaseRepository } from "./base.repository";

export class IssueRepository extends BaseRepository<Issue> {
  constructor() {
    super(Issue);
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async findByReporterId(reporterId: string) {
    return this.model.findAll({
      where: {
        reporterId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async updateById(id: string, data: Partial<Issue>) {
    const issue = await this.model.findByPk(id);

    if (!issue) {
      return null;
    }

    await issue.update(data);

    return issue;
  }
}