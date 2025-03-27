import pool from "../config/db";
import userRepo from "../repo/user.repo";

class UserService {
  async createAppointment(user: any) {
    const { patientId, doctorId, date, time, ReceptionistID, HospitalBranchID } = user;

    const client = await pool.connect();

    // availibitly doctor
    const isAvailable = await userRepo.checkDoctorAvailability(client, doctorId, date, time);

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