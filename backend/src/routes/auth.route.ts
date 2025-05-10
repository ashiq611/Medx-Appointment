import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const router = Router();


router.post('/register', expressAsyncHandler(authController.register));
router.post('/login',passport.authenticate('local'), expressAsyncHandler(authController.login));
router.get('/status',isAuthenticated,expressAsyncHandler(authController.status));

router.post('/2fa/setup',isAuthenticated, expressAsyncHandler(authController.setup2fa));
router.post('/2fa/verify', expressAsyncHandler(authController.verify2fa));
router.post('/2fa/reset', expressAsyncHandler(authController.reset2fa));


router.put('/change-password', expressAsyncHandler(authController.changePassword));
router.post('/forgot-password', expressAsyncHandler(authController.forgotPassword));
router.post('/reset-password', expressAsyncHandler(authController.resetPassword));

router.post('/logout',isAuthenticated, expressAsyncHandler(authController.logout));



export default router;
