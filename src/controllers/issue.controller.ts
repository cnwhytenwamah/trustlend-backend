import { Request, Response } from "express";
import { issueService } from "../services/issue.service";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const issueController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const issue = await issueService.create(
      req.user.userId,
      req.body
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Issue reported successfully",
      data: issue,
    });
  },

  async myIssues(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const issues = await issueService.listMyIssues(
      req.user.userId
    );

    return sendSuccess(res, {
      message: "Your issues retrieved successfully",
      data: issues,
    });
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const issue = await issueService.getById(id);

    return sendSuccess(res, {
      message: "Issue retrieved successfully",
      data: issue,
    });
  },

  async update(req: Request, res: Response) {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const issue = await issueService.update(
      req.user.userId,
      id,
      req.body
    );

    return sendSuccess(res, {
      message: "Issue updated successfully",
      data: issue,
    });
  },
};