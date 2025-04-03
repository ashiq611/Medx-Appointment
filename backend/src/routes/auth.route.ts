import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/register', expressAsyncHandler(authController.register));
router.post('/login', expressAsyncHandler(authController.login));
// router.post('/setup-2fa', expressAsyncHandler(authController.setup2fa));
// router.post('/verify-2fa', expressAsyncHandler(authController.verify2fa));
// router.post('/logout', expressAsyncHandler(authController.logout));

export default router;
