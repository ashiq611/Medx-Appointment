import pool from "../config/db";
import doctorRepo from "../repo/doctor.repo";
import hospitalRepo from "../repo/hospital.repo";
import userRepo from "../repo/user.repo";
import { getDayFromDate } from "../utils/getDayFromDate";

class UserService {
  async createAppointment(user: any) {
    const { patientId, doctorId, date, ReceptionistID, HospitalBranchID } = user;
  
    try {
      const client = await pool.connect();
  
      // Step 1: Get all schedules for the doctor
      const allSchedules = await doctorRepo.getDoctorSchedule(client, doctorId);
      const dayofDate = getDayFromDate(date); // e.g., 'Monday', 'Tuesday'
  
      // console.log("All schedules:", allSchedules);
      // console.log("Requested day:", dayofDate);
  
      // Step 2: Find the schedule that matches the day of the appointment
      const schedule = allSchedules.find((s: any) => s.day.toLowerCase() === dayofDate.toLowerCase());
  
      if (!schedule) {
        return {
          success: true,
          data: {
            message: "Doctor is not available at this time"
          }
        };
      }
  
      // Step 3: Create the appointment using the matched schedule
      const result = await userRepo.createAppointment(client, {
        ...user,
        ScheduleID: schedule.scheduleid
      });

      // console.log("Result:", result);
  
      return {
        success: true,
        data: result
      };
  
    } catch (err) {
      console.error("createAppointment error:", err);
      return {
        success: false,
        error: "Internal Server Error"
      };
    }
  }
  
  async getSchedule(doctorid: any) {
    try {
      const client = await pool.connect();
      const result = await doctorRepo.getDoctorSchedule(client, doctorid);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getBranch() {
    try {
      const client = await pool.connect();
      const result = await hospitalRepo.getBranch(client);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getBranchWiseDoctor(branchid: any) {
    try {
      const client = await pool.connect();
      const result = await doctorRepo.getBranchWiseDoctor(client, branchid);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getDoctorDetails(doctorid: any) {
    try {
      const client = await pool.connect();
      const getSchedule = await doctorRepo.getDoctorSchedule(client, doctorid);
      const doctorDetails = await doctorRepo.getDoctorDetails(client, doctorid);
      return { ...doctorDetails, scheduleList: getSchedule };
    } catch (err) {
      console.log(err);
    }
  }
}

export default new UserService();
