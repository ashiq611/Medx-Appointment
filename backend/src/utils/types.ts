import { Request } from "express";

export interface JwtPayloadWithRole {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface CustomRequest extends Request {
  user?: JwtPayloadWithRole;
}