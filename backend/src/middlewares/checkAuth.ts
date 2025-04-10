
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const checkAuth = (req: Request, res : Response, next: NextFunction) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded; // Store decoded user info in request object
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
  