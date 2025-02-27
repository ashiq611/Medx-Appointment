import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// Fix the paths by adding a `/` before the routes
router.post('/register', expressAsyncHandler(authController.register));
router.post('/login', expressAsyncHandler(authController.login));

export default router;
