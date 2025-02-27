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
     try{
        const user = await authService.login(req.body)
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

}

export default new AuthController()