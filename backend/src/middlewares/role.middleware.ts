// middleware/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../utils/types";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: Access denied" });
      return;
    }

    next();
  };
};

export default authorizeRoles;