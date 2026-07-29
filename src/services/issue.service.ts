import { IssueRepository } from "../repositories/issue.repository";
import {
  CreateIssueInput,
  UpdateIssueInput,
} from "../validators/issue.validator";
import { AppError } from "../utils/AppError";

const issueRepository = new IssueRepository();

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const issueService = {
  async create(
    reporterId: string,
    input: CreateIssueInput
  ) {
    const issue = await issueRepository.create({
      bookingId: input.bookingId,
      reporterId,
      description: input.description,
      photoUrls: input.photoUrls ?? [],
      status: "open",
      resolutionNotes: null,
    } as never);

    return issue;
  },

  async listMyIssues(reporterId: string) {
    return issueRepository.findByReporterId(reporterId);
  },

  async getById(id: string) {
    if (!uuidRegex.test(id)) {
      throw AppError.badRequest("Invalid issue ID");
    }

    const issue = await issueRepository.findById(id);

    if (!issue) {
      throw AppError.notFound("Issue not found");
    }

    return issue;
  },

  async update(
    reporterId: string,
    id: string,
    input: UpdateIssueInput
  ) {
    if (!uuidRegex.test(id)) {
      throw AppError.badRequest("Invalid issue ID");
    }

    const issue = await issueRepository.findById(id);

    if (!issue) {
      throw AppError.notFound("Issue not found");
    }

    if (issue.reporterId !== reporterId) {
      throw AppError.forbidden(
        "You are not allowed to update this issue"
      );
    }

    return issueRepository.updateById(id, input);
  },
};