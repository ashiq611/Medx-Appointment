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

    updateDoctor: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.updateDoctor(req.body)
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

    deleteDoctor: RequestHandler = async (req, res) => {
        try {
            console.log(req.params.doctorid, "req.params.doctorid")
            const result = await adminService.deleteDoctor(req.params.doctorid)
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

    updateBranch: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.updateBranch(req.body)
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

    deleteBranch: RequestHandler = async (req, res) => {
        try {
            console.log(req.params.branchid)
            const result = await adminService.deleteBranch(req.params.branchid)
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

    updateSpeciality: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.updateSpeciality(req.body)
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

    updateDepartment: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.updateDepartment(req.body)
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

    deleteSchedule: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.deleteSchedule(req.params.scheduleid)
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

    addUser: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.addUser(req.body)
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

    getAllAdminReception: RequestHandler = async (req, res) => {
        try {
            const result = await adminService.getAllAdminReception()
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
   

}

export default new AdminController()