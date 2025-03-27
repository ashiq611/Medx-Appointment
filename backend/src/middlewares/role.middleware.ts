import { Request, Response, NextFunction } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as { role: string };

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: Access denied" });
      return; // 🚨 Important: return here to avoid falling through
    }

    next(); // only call next if authorized
  };
};

export default authorizeRoles;