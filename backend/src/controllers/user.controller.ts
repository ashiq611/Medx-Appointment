import { RequestHandler } from "express"
import userService from "../services/user.service"

class UserController {
    createAppointment: RequestHandler = async (req,res) => {
        try {
            const result = await userService.createAppointment(req.body)
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


}

export default new UserController()