import { NextFunction, Request, RequestHandler, Response } from "express"
import authService from "../services/auth.service"
import { conflictResponse, createdResponse, successResponse, unauthorizedResponse } from "../utils/response"
import logger from "../utils/logger"
import { MyLogger } from "../utils/loki-logger"




class AuthController {

   register: RequestHandler = async (req,res) => {
      try {
         const result = await authService.register(req.body)

         if (result?.message === "User already exists") {

            conflictResponse(res, result?.message)
          }
   
         createdResponse(res, result, "User registered successfully")
      } catch (err) {
         console.log(err)
         res.status(500).json({
            success: false,
            message: "Internal Server Error"
         })
      }
   }
   login: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
      // if (req.user.id !== req.params.id) {
      //    return res.status(403).json({ message: "Forbidden: Access denied" });
      //  }
     try{
        const user = await authService.login(req)
        MyLogger.info("/Login", user)
       successResponse(res, user, "User logged in successfully")
     }catch(err){
      MyLogger.error("Login error", err)
     logger.errorLogger({
      
         method: "POST",
         message: "Login failed",
         data: "",
         traceId: Date.now().toString(),
       

     })
        console.log(err)
         next(err)
        
     }
  }
  status: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        const user = await authService.status(req)
         if (user?.message === "Unauthorized user") {
               unauthorizedResponse(res, user?.message)
          }
        successResponse(res, user, "User status")
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  setup2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        const user = await authService.setup2fa(req)
        successResponse(res, user, "2FA setup successfully")
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  verify2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        const user = await authService.verify2fa(req)
        successResponse(res, user, "2FA verified successfully")
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  reset2fa: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        const user = await authService.reset2fa(req)
        successResponse(res, user, "2FA reset successfully")
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  logout: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        const result = await authService.logout(req)
         if (result?.message === "Unauthorized user") {
             unauthorizedResponse(res, result?.message)
          }

          successResponse(res, result, "User logged out successfully")
        
     }catch(err){
        console.log(err)
        next(err)
     }
  }

}

export default new AuthController()