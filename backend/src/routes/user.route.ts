import { Router } from "express";
import authController from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";

import verifyToken from "../middlewares/auth.middleware";
import authorizeRoles from "../middlewares/role.middleware";
import  {RoleNamesEnum}  from "../utils/RoleNames";
import userController from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const router = Router();

// admin can access 
router.get('/admin',
    verifyToken,
    authorizeRoles(RoleNamesEnum.ADMIN),
    expressAsyncHandler((req, res) => {
      res.status(200).json({
        success: true,
        data: "admin"
      });
    })
  );

// doctor can access 
router.get('/doctor',verifyToken,authorizeRoles(RoleNamesEnum.DOCTOR, RoleNamesEnum.ADMIN), expressAsyncHandler((req, res) => {
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


router.post('/appointment', isAuthenticated,expressAsyncHandler(userController.createAppointment));

router.get('/schedule/:doctorid',isAuthenticated, expressAsyncHandler(userController.getSchedule));

router.get('/get-all-hospital',isAuthenticated, expressAsyncHandler(userController.getBranch));

router.get('/get-branch-wise-doctor/:branchid',isAuthenticated, expressAsyncHandler(userController.getBranchWiseDoctor));

router.get('/doctor-details/:doctorid',isAuthenticated, expressAsyncHandler(userController.getDoctorDetails));

export default router;
