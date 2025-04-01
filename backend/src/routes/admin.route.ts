import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";

import verifyToken from "../middlewares/auth.middleware";
import authorizeRoles from "../middlewares/role.middleware";
import  {RoleNamesEnum}  from "../utils/RoleNames";
import userController from "../controllers/user.controller";

const router = Router();

router.get('/get-all-schedules/:doctorid?', expressAsyncHandler(userController.getAllSchedules));






export default router;
