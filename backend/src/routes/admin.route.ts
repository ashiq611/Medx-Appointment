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
router.put('/update-doctor', expressAsyncHandler(adminController.updateDoctor));
router.delete('/delete-doctor/:doctorid', expressAsyncHandler(adminController.deleteDoctor));
router.post('/add-branch', expressAsyncHandler(adminController.addBranch));
router.put('/update-branch', expressAsyncHandler(adminController.updateBranch));
router.delete('/delete-branch/:branchid', expressAsyncHandler(adminController.deleteBranch));
// router.post('/add-hospital', expressAsyncHandler(adminController.addHospital));
router.get('/get-speciality-department', expressAsyncHandler(adminController.getSpecialityDepartment));
router.post('/add-speciality', expressAsyncHandler(adminController.addSpeciality));
router.put('/update-speciality', expressAsyncHandler(adminController.updateSpeciality));
router.post('/add-department', expressAsyncHandler(adminController.addDepartment));
router.put('/update-department', expressAsyncHandler(adminController.updateDepartment));
router.post('/add-schedule', expressAsyncHandler(adminController.addSchedule));
router.delete('/delete-schedule/:scheduleid', expressAsyncHandler(adminController.deleteSchedule));
router.post('/add-user', expressAsyncHandler(adminController.addUser));
router.get('/get-all-admin-reception', expressAsyncHandler(adminController.getAllAdminReception));






export default router;
