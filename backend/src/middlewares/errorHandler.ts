import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  errorResponse(res, err);
  
}