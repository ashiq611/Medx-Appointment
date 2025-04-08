import { NextFunction, Request, RequestHandler, Response } from "express"
import authService from "../services/auth.service"
import {  successResponse } from "../utils/response"
import logger from "../utils/logger"
import { MyLogger } from "../utils/loki-logger"
import { serializeResponseToNext } from "../utils/serializeResponseToNext"




class AuthController {

   register: RequestHandler = async (req,res,next) => {
      try {
       await authService.register(req,res,next)

         
      } catch (err) {
         console.log(err)
         res.status(500).json({
            success: false,
            message: "Internal Server Error"
         })
      }
   }
   login: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     
     try{
        const user = await authService.login(req,res, next)
        
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
        const user = await authService.status(req,res, next)
         console.log(user, "user")
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  setup2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        await authService.setup2fa(req,res, next)
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  verify2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        await authService.verify2fa(req,res,next)
       
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  reset2fa: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        const user = await authService.reset2fa(req,res, next)
    
     }catch(err){
        console.log(err)
        next(err)
     }
  }
  logout: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        await authService.logout(req,res, next)
         // serializeResponseToNext(res, data, next)  
     }catch(err){
        console.log(err)
        next(err)
     }
  }

   changePassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
       try{
        await authService.changePassword(req,res, next)
          
       }catch(err){
         console.log(err)
         next(err)
       }
   }

   forgotPassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
      try{
         await authService.forgotPassword(req,res, next)
       
       }catch(err){
         console.log(err)
         next(err)
       }
   }

   resetPassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
      try{
         const user = await authService.resetPassword(req, res, next)
       }catch(err){
         console.log(err)
         next(err)
       }
   }

}

export default new AuthController()