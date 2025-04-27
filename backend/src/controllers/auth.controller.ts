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

       logger.requestLogger({
          method: "POST",
          message: "Registration successful",
          data: { name: req.body.name, phone_number: req.body.phone_number },
          traceId: Date.now().toString(),
       })

       MyLogger.info("Registration successful", {
          name: req.body.name,
          phone_number: req.body.phone_number,
       })

         
      } catch (err) {
         const safeError = {
            name: (err as Error).name,
            message: (err as Error).message,
            stack: (err as Error).stack,
        };

       MyLogger.error("Registration error", safeError);

       logger.errorLogger({
           method: "POST",
           message: "Reghistration failed",
           data: safeError,
           traceId: Date.now().toString(),
       });

         console.log(err)
         res.status(500).json({
            success: false,
            message: "Internal Server Error"
         })
      }
   }
   login: RequestHandler = async (req, res, next) => {
      try {
          await authService.login(req, res, next);
  
          logger.requestLogger({
              method: "POST",
              message: "Login successful",
              data: { phone_number: req.body.phone_number },
              traceId: Date.now().toString(),
          });
  
          MyLogger.info("Login successful", { phone_number: req.body.phone_number });
      } catch (err: any) {
            const safeError = {
               name: (err as Error).name,
               message: (err as Error).message,
               stack: (err as Error).stack,
           };
  
          MyLogger.error("Login error", safeError);
  
          logger.errorLogger({
              method: "POST",
              message: "Login failed",
              data: safeError,
              traceId: Date.now().toString(),
          });
  
          console.log(err);
          next(err);
      }
  };
  
  status: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
         await authService.status(req,res, next)

         logger.requestLogger({
             method: "GET",
             message: "Status successful",
             data: { Status: "Active" },
             traceId: Date.now().toString(),
         })

         MyLogger.info("Status successful", { phone_number: req.body.phone_number })

     }catch(err){

      const safeError = {
         name: (err as Error).name,
         message: (err as Error).message,
         stack: (err as Error).stack,
     };

     MyLogger.error("Status error", safeError);

     logger.errorLogger({
         method: "POST",
         message: "Status failed",
         data: safeError,
         traceId: Date.now().toString(),
     });
        
        console.log(err)
        next(err)
     }
  }
  setup2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        await authService.setup2fa(req,res, next)

        logger.requestLogger({
            method: "POST",
            message: "Setup2fa successful",
            data: { Status: "Success"},
            traceId: Date.now().toString(),
        })

        MyLogger.info("Setup2fa successful", { data: "Success" })
     }catch(err){
      const safeError = {
         name: (err as Error).name,
         message: (err as Error).message,
         stack: (err as Error).stack,
     };

     MyLogger.error("setup2fa error", safeError);

     logger.errorLogger({
         method: "POST",
         message: "Setup2fa failed",
         data: safeError,
         traceId: Date.now().toString(),
     });

        console.log(err)
        next(err)
     }
  }
  verify2fa: RequestHandler = async(req: Request, res : Response,next: NextFunction) => {
     try{
        await authService.verify2fa(req,res,next)

        logger.requestLogger({
            method: "POST",
            message: "verify2fa successful",
            data: { Status: "Success"},
            traceId: Date.now().toString(),
        })

        MyLogger.info("verify2fa successful", { data: "Success" })

        
       
     }catch(err){

      const safeError = {
         name: (err as Error).name,
         message: (err as Error).message,
         stack: (err as Error).stack,
     };

     MyLogger.error("verify2fa error", safeError);

     logger.errorLogger({
         method: "POST",
         message: "verify2fa failed",
         data: safeError,
         traceId: Date.now().toString(),
     });
        console.log(err)
        next(err)
     }
  }
  reset2fa: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        const user = await authService.reset2fa(req,res, next)

        logger.requestLogger({
            method: "POST",
            message: "reset2fa successful",
            data: { Status: "Success"},
            traceId: Date.now().toString(),
        })

        MyLogger.info("reset2fa successful", { data: "Success" })
    
     }catch(err){

      const safeError = {
         name: (err as Error).name,
         message: (err as Error).message,
         stack: (err as Error).stack,
     };

     MyLogger.error("reset2fa error", safeError);

     logger.errorLogger({
         method: "POST",
         message: "reset2fa failed",
         data: safeError,
         traceId: Date.now().toString(),
     });
        console.log(err)
        next(err)
     }
  }
  logout: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
     try{
        await authService.logout(req,res, next)
         // serializeResponseToNext(res, data, next)  

         logger.requestLogger({
             method: "POST",
             message: "logout successful",
             data: { Status: "Success"},
             traceId: Date.now().toString(),
         })

         MyLogger.info("logout successful", { data: "Success" })
     }catch(err){
      const safeError = {
         name: (err as Error).name,
         message: (err as Error).message,
         stack: (err as Error).stack,
     };

     MyLogger.error("logout error", safeError);

     logger.errorLogger({
         method: "POST",
         message: "logout failed",
         data: safeError,
         traceId: Date.now().toString(),
     });

        console.log(err)
        next(err)
     }
  }

   changePassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
       try{
        await authService.changePassword(req,res, next)

        logger.requestLogger({
            method: "POST",
            message: "changePassword successful",
            data: { Status: "Success"},
            traceId: Date.now().toString(),
        })

        MyLogger.info("changePassword successful", { data: "Success" })
          
       }catch(err){

         const safeError = {
            name: (err as Error).name,
            message: (err as Error).message,
            stack: (err as Error).stack,
        };
   
        MyLogger.error("changePassword error", safeError);
   
        logger.errorLogger({
            method: "POST",
            message: "changePassword failed",
            data: safeError,
            traceId: Date.now().toString(),
        });


         console.log(err)
         next(err)
       }
   }

   forgotPassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
      try{
         await authService.forgotPassword(req,res, next)

         logger.requestLogger({
             method: "POST",
             message: "forgotPassword successful",
             data: { Status: "Success"},
             traceId: Date.now().toString(),
         })

         MyLogger.info("forgotPassword successful", { data: "Success" })
       
       }catch(err){
         const safeError = {
            name: (err as Error).name,
            message: (err as Error).message,
            stack: (err as Error).stack,
        };
   
        MyLogger.error("forgotPassword error", safeError);
   
        logger.errorLogger({
            method: "POST",
            message: "forgotPassword failed",
            data: safeError,
            traceId: Date.now().toString(),
        });

         console.log(err)
         next(err)
       }
   }

   resetPassword: RequestHandler = async(req: Request, res : Response, next: NextFunction) => {
      try{
         const user = await authService.resetPassword(req, res, next)

         logger.requestLogger({
             method: "POST",
             message: "resetPassword successful",
             data: { Status: "Success"},
             traceId: Date.now().toString(),
         })

         MyLogger.info("resetPassword successful", { data: "Success" })
       }catch(err){

         const safeError = {
            name: (err as Error).name,
            message: (err as Error).message,
            stack: (err as Error).stack,
        };
   
        MyLogger.error("resetPassword error", safeError);
   
        logger.errorLogger({
            method: "POST",
            message: "resetPassword failed",
            data: safeError,
            traceId: Date.now().toString(),
        });

         console.log(err)
         next(err)
       }
   }

}

export default new AuthController()