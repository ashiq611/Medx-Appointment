import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";

import verifyToken from "../middlewares/auth.middleware";
import authorizeRoles from "../middlewares/role.middleware";
import  {RoleNamesEnum}  from "../utils/RoleNames";
import userController from "../controllers/user.controller";
import adminController from "../controllers/admin.controller";

const router = Router();

router.get('/get-all-schedules/:doctorid?', expressAsyncHandler(userController.getAllSchedules));
router.get('/get-appointment', expressAsyncHandler(adminController.getAppointment));
router.post('/appointment', expressAsyncHandler(adminController.createAppointment));
router.post('/add-doctor', expressAsyncHandler(adminController.addDoctor));
router.post('/add-branch', expressAsyncHandler(adminController.addBranch));
// router.post('/add-hospital', expressAsyncHandler(adminController.addHospital));
router.get('/get-speciality-department', expressAsyncHandler(adminController.getSpecialityDepartment));
router.post('/add-speciality', expressAsyncHandler(adminController.addSpeciality));
router.post('/add-department', expressAsyncHandler(adminController.addDepartment));
router.post('/add-schedule', expressAsyncHandler(adminController.addSchedule));






export default router;
