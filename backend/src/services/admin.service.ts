import pool from "../config/db";
import authRepo from "../repo/auth.repo";
import doctorRepo from "../repo/doctor.repo";
import hospitalRepo from "../repo/hospital.repo";
import { getDayFromDate } from "../utils/getDayFromDate";

class AdminService {
    getAppointment = async (doctorid: any, date: any) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT 
                a.AppointmentID,
                a.AppointmentDate,
                a.Status,
                a.AppointmentSerialNumber,
                a.CreatedOn,
                a.UpdatedOn,
            
                -- Patient details
                p.PatientID,
                p.Name AS PatientName,
                p.ContactInformation AS PatientContact,
                p.DateOfBirth,
                p.MedicalHistory,
            
                -- Doctor details
                d.DoctorID,
                d.Name AS DoctorName,
                d.ContactInformation AS DoctorContact,
            
                -- Hospital Branch details
                hb.HospitalBranchID,
                hb.BranchName,
                hb.Location AS BranchLocation,
                hb.ContactInformation AS BranchContact,
            
                -- Schedule details
                s.ScheduleID,
                s.Day AS ScheduleDay,
                s.StartSlot,
                s.EndSlot,
                s.Availability
            
            FROM 
                Appointment a
            JOIN 
                Patient p ON a.PatientID = p.PatientID
            JOIN 
                Doctor d ON a.DoctorID = d.DoctorID
            JOIN 
                HospitalBranch hb ON a.HospitalBranchID = hb.HospitalBranchID
            JOIN 
                Schedule s ON a.ScheduleID = s.ScheduleID
            
            WHERE 
                a.DoctorID = $1
                AND DATE(a.AppointmentDate) = $2
            ORDER BY 
                a.AppointmentSerialNumber ASC;
            `,
                [doctorid, date]
            );
            return result.rows;
        } catch (err) {
            console.log(err);
        } finally {
            client.release();
        }
    }
    async createAppointment(user: any) {
        const { patientname, doctorId, date, ReceptionistID, HospitalBranchID, phone_number } = user;
        const client = await pool.connect();
      
        try {


            // create patient retrun patientId
            const patient = await hospitalRepo.createPatient(client, {
                name: patientname,
                contactinformation: phone_number
            }); 
            const patientId = patient.patientid;
            // console.log("Patient ID:", patientId);
      
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
          const result = await hospitalRepo.createAppointment(client, {
            ...user,
            patientId: patientId,
            ScheduleID: schedule.scheduleid
          });
    
          // console.log("Result:", result);
      
          return result;
      
        } catch (err) {
          console.error("createAppointment error:", err);
          return {
            success: false,
            error: "Internal Server Error"
          };
        } finally {
          client.release();
        }
      }
    async addDoctor(user: any) {
        const client = await pool.connect();
        try {
            const result = await authRepo.addDoctor(client, user);
            return result;
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    } 
    async addBranch(data: any) {
        const client = await pool.connect();
        try {
            const result = await hospitalRepo.addBranch(client, data);
            return result;
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }
  
}

export default new AdminService();
