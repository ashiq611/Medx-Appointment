import { RequestHandler } from "express"
import adminService from "../services/admin.service"

class AdminController {
    getAppointment: RequestHandler = async (req, res) => {
        // query params
        const { doctorid, date } = req.query
        try {
            const result = await adminService.getAppointment(doctorid, date)
            res.status(200).json({
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
    addDoctor: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addDoctor(req.body)
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

    addBranch: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addBranch(req.body)
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

    getSpecialityDepartment: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.getSpecialityDepartment()
            res.status(200).json({
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

    addSpeciality: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addSpeciality(req.body)
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

    addDepartment: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addDepartment(req.body)
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

    addSchedule: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addSchedule(req.body);
    
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            } else {
                res.status(201).json({
                    success: true,
                    data: result.data
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
   

}

export default new AdminController()