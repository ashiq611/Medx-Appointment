import { Response } from "express";

export function successResponse(res: Response, data: any, message: string = "Success") {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}
// export function errorResponse(res: Response, message: string, statusCode: number = 500) {
//   return res.status(statusCode).json({
//     success: false,
//     message,
//   });
// }
export function errorResponse(res: Response, status: number, error: string) {
  return res.status(status).json({
    success: false,
    error,
  });
}
export function notFoundResponse(res: Response, message: string = "Not Found") {
  return res.status(404).json({
    success: false,
    message,
  });
}
export function unauthorizedResponse(res: Response, message: string = "Unauthorized") {
  return res.status(401).json({
    success: false,
    message,
  });
}
export function badRequestResponse(res: Response, message: string = "Bad Request") {
  return res.status(400).json({
    success: false,
    message,
  });
}
export function forbiddenResponse(res: Response, message: string = "Forbidden") {
  return res.status(403).json({
    success: false,
    message,
  });
}
export function internalServerErrorResponse(res: Response, message: string = "Internal Server Error") {
  return res.status(500).json({
    success: false,
    message,
  });
}
export function createdResponse(res: Response, data: any, message: string = "Created") {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}
export function noContentResponse(res: Response, message: string = "No Content") {  
  return res.status(204).json({
    success: true,
    message,
  });
}
export function notModifiedResponse(res: Response, message: string = "Not Modified") {  
  return res.status(304).json({
    success: true,
    message,
  });
}

export function conflictResponse(res: Response, message: string = "Conflict") {
  return res.status(409).json({
    success: false,
    message,
  });
}