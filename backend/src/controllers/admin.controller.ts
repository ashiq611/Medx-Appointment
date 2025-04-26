import { RequestHandler } from "express"
import adminService from "../services/admin.service"

class AdminController {
    getAppointment: RequestHandler = async (req, res) => {
        // query params
        const { doctorid, date } = req.query
        try {
            const result = await adminService.getAppointment(doctorid, date)
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
     createAppointment: RequestHandler = async (req,res) => {
            try {
                const result = await adminService.createAppointment(req.body)
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

export default new AdminController()