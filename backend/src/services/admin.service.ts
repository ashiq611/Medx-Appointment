import pool from "../config/db";
import authRepo from "../repo/auth.repo";
import doctorRepo from "../repo/doctor.repo";
import hospitalRepo from "../repo/hospital.repo";
import { getDayFromDate } from "../utils/getDayFromDate";
import bcrypt from "bcryptjs"
import { RoleNamesEnum } from "../utils/RoleNames";

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
            let password = "12345678" ;
             const hashedPassword = bcrypt.hashSync(password, 10);

             const hospitalId = await hospitalRepo.getHospitalId(client, user.hospitalbranchid);
            const doctorDetails = await doctorRepo.addDoctor(client, user);
            const id = doctorDetails.doctorid;
            const result = await authRepo.addDoctorUser(client, { ...user, id, password: hashedPassword, hospitalId });
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

    async getSpecialityDepartment() {
        const client = await pool.connect();
        try {
            const getSpeciality = await hospitalRepo.getSpeciality(client);
            const getDepartment = await hospitalRepo.getDepartment(client);

            return {
                speciality: getSpeciality,
                department: getDepartment
            };
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }

    async addSpeciality(data: any) {
        const client = await pool.connect();
        try {
            const result = await hospitalRepo.addSpeciality(client, data);
            return result;
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }

    async addDepartment(data: any) {
        const client = await pool.connect();
        try {
            const result = await hospitalRepo.addDepartment(client, data);
            return result;
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }

    async addSchedule(data: any) {
        const client = await pool.connect();
        try {
            const isScheduleExist = await doctorRepo.isScheduleExist(client, data);
            if (isScheduleExist) {
                return {
                    success: false,
                    message: "Schedule already exists"
                };
            }
    
            const result = await doctorRepo.addSchedule(client, data);
            return {
                success: true,
                data: result
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                message: "Something went wrong"
            };
        } finally {
            client.release();
        }
    }

    addUser = async (user: any) => {
        const client = await pool.connect();
        try {
            if(user.role == RoleNamesEnum.ADMIN){
                const hashedPassword = bcrypt.hashSync(user.password, 10);
                const {adminid} = await authRepo.addAdmin(client, user);
                console.log("Admin ID:", adminid);
                const result = await authRepo.addAdminUser(client, { ...user, password: hashedPassword , admin_id: adminid});
                return result;
            }

            if(user.role == RoleNamesEnum.RECEPTION){
                const hashedPassword = bcrypt.hashSync(user.password, 10);
                const {receptionistid} = await authRepo.addReceptionist(client, user);
                console.log("Receptionist ID:", receptionistid);
                const result = await authRepo.addReceptionistUser(client, { ...user, password: hashedPassword, receptionist_id: receptionistid});
                return result;
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }

    getAllAdminReception = async () => {
        const client = await pool.connect();
        try {
            const getAdmin = await authRepo.getAllAdmin(client);
            const getReceptionist = await authRepo.getAllReceptionist(client);

            return {
                admin: getAdmin,
                receptionist: getReceptionist
            };
        } catch (err) {
            console.log(err);
        }
        finally {
            client.release();
        }
    }
  
}

export default new AdminService();
