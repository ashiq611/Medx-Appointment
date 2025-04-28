import { RequestHandler } from "express"
import userService from "../services/user.service"
import logger from "../utils/logger"

class UserController {
    createAppointment: RequestHandler = async (req,res) => {
        try {
            const result = await userService.createAppointment(req.body)

            logger.requestLogger({method: req.method, data: req.body, message: "Create Appointment", traceId: result.traceId})

             
            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            };

             logger.errorLogger({
                       method: req.method,
                       message: "resetPassword failed",
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
    getSchedule: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getSchedule(req.params.doctorid)

            logger.requestLogger({method: req.method, data: req.body, message: "Get Schedule", traceId: result.traceId})
            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            };

             logger.errorLogger({
                       method: req.method,
                       message: "getSchedule failed",
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
    getBranch: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getBranch()

            logger.requestLogger({method: req.method, data: req.body, message: "Get Branch", traceId: result.traceId})

            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            };

             logger.errorLogger({
                       method: req.method,
                       message: "getBranch failed",
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
    getBranchWiseDoctor: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getBranchWiseDoctor(req.params.branchid)

            logger.requestLogger({method: req.method, data: req.body, message: "Get Branch Wise Doctor", traceId: result.traceId})
            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            };

             logger.errorLogger({
                       method: req.method,
                       message: "getBranchWiseDoctor failed",
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
    getDoctorDetails: RequestHandler = async (req,res) => {
        try {
            const result = await userService.getDoctorDetails(req.params.doctorid)

            logger.requestLogger({method: req.method, data: req.body, message: "Get Doctor Details", traceId: result.traceId})
            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            };

             logger.errorLogger({
                       method: req.method,
                       message: "getDoctorDetails failed",
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

    getAllSchedules: RequestHandler = async (req,res) => {
        const { doctorid } = req.params;
        try {
            const result = await userService.getAllSchedules(doctorid)

            logger.requestLogger({method: req.method, data: result, message: "Get All Schedules", traceId: result.traceId})
            res.status(201).json({
                success: true,
                data: result
            })
        } catch (err) {

            const safeError = {
                name: (err as Error).name,
                message: (err as Error).message,
                stack: (err as Error).stack,
            }

             logger.errorLogger({
                       method: req.method,
                       message: "getAllSchedules failed",
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


}

export default new UserController()