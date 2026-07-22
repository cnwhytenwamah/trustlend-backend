import { Request } from "express";
import { AppError } from "./AppError";

export function getParam(req: Request, key: string): string {
  const value = req.params[key];

  if (typeof value !== "string") {
    throw new AppError(`Invalid or missing parameter: ${key}`, 400);
  }

  return value;
}