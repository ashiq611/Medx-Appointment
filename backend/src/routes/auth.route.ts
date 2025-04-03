import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";
import passport from "passport";

const router = Router();


router.post('/register', expressAsyncHandler(authController.register));
router.post('/login',passport.authenticate('local'), expressAsyncHandler(authController.login));
// router.post('/2fa/setup', expressAsyncHandler(authController.setup2fa));
// router.post('/2fa/verify', expressAsyncHandler(authController.verify2fa));
// router.post('/2fa/reset', expressAsyncHandler(authController.reset2fa));
// router.post('/logout', expressAsyncHandler(authController.logout));

export default router;
