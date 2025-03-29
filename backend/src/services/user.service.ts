import pool from "../config/db";
import doctorRepo from "../repo/doctor.repo";
import userRepo from "../repo/user.repo";
import { getDayFromDate } from "../utils/getDayFromDate";

class UserService {
  async createAppointment(user: any) {
    const { patientId, doctorId, date, ReceptionistID, HospitalBranchID } = user;
    let isAvailable;

    const client = await pool.connect();

    // getSchedule
    const getSchedule = await doctorRepo.getDoctorSchedule(client, doctorId);


    // availibitly doctor
    const dayofDate = getDayFromDate(date);
    if(dayofDate !== getSchedule.day){
      isAvailable = false;
    }else{
      isAvailable = true;
    }
    
    if (!isAvailable) {
      return {
        message: "Doctor is not available at this time",
        };
    }

    // Create user
    const result = await userRepo.createAppointment(client,user);
    return result;
  }
}

export default new UserService();