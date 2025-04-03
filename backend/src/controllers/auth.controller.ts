import { Request, RequestHandler, Response } from "express"
import authService from "../services/auth.service"




class AuthController {

   register: RequestHandler = async (req,res) => {
      try {
         const result = await authService.register(req.body)
   
         res.status(201).json({
            success: true,
            data: result
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({
            success: false,
            message: "Internal Server Error"
         })
      }
   }
   login: RequestHandler = async(req: Request, res : Response) => {
      // if (req.user.id !== req.params.id) {
      //    return res.status(403).json({ message: "Forbidden: Access denied" });
      //  }
     try{
        const user = await authService.login(req)
        res.status(200).json({
            success: true,
            data: user
        })
     }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
     }
  }
  status: RequestHandler = async(req: Request, res : Response) => {
     try{
        const user = await authService.status(req)
        res.status(200).json({
            success: true,
            data: user
        })
     }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
     }
  }
  setup2fa: RequestHandler = async(req: Request, res : Response) => {
     try{
        const user = await authService.setup2fa(req)
        res.status(200).json({
            success: true,
            data: user
        })
     }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
     }
  }
  logout: RequestHandler = async(req: Request, res : Response) => {
     try{
        const message = await authService.logout(req)
        res.status(200).json({
            success: true,
            data: message
        })
     }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
     }
  }

}

export default new AuthController()