import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: { role: string };
}

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: Access denied" });
      return; // 🚨 Important: return here to avoid falling through
    }

    next();
  };
};

export default authorizeRoles;