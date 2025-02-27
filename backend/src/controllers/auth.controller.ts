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
   login = (req: Request, res : Response) => {
      res.send('login')
  }

}

export default new AuthController()