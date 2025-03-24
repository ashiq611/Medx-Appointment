import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

// admin can access 
router.get('/admin',verifyToken, expressAsyncHandler((req, res) => {
    res.status(200).json({
        success: true,
        data: "admin"
    })
}));

// doctor can access 
router.get('/doctor',verifyToken, expressAsyncHandler((req, res) => {
    res.status(200).json({
        success: true,
        data: "doctor"
    })
}));

// reciption can access 
router.get('/reciption', expressAsyncHandler(authController.register));

// patient can access 
router.get('/patient',verifyToken, expressAsyncHandler((req, res) => {
    res.status(200).json({
        success: true,
        data: "patient"
    })
}));

export default router;
