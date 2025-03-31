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
    getSchedule: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getSchedule(req.params.doctorid)
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
    getBranch: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getBranch()
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
    getBranchWiseDoctor: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getBranchWiseDoctor(req.params.branchid)
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
    getDoctorDetails: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getDoctorDetails(req.params.doctorid)
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