class DoctorRepo {
    async getDoctors(client: any) {
        try {
            const query = {
                text: "SELECT * FROM public.\"Doctor\"",
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }
    // async checkDoctorAvailability(client: any, doctorId: any, date: any, time: any) {
    //     try {
    //         const query = {
    //             text: "SELECT * FROM public.\"Appointment\" WHERE DoctorID = $1 AND AppointmentDate = $2 AND Status = $3",
    //             values: [doctorId, `${date} ${time}`, 'Scheduled'],
    //         };
    //         const responseData = await client.query(query);
    //         return responseData.rows.length === 0;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    async getDoctorSchedule(client: any, doctorId?: any) {
        let queryText: string;
        let values: any[] = [];
    
        try {
            if (doctorId) {
                queryText = "SELECT * FROM schedule WHERE DoctorID = $1";
                values = [doctorId];
            } else {
                queryText = "SELECT * FROM schedule";
                values = []; // No values needed when fetching all
            }
    
            const result = await client.query(queryText, values);
            return result.rows;
        } catch (err) {
            console.error("Error fetching doctor schedule:", err);
            throw err; // Rethrow the error for upstream handling
        }
    }

    async getBranchWiseDoctor(client: any, branchid: any) {
        try {
            const query = {
                text: `
                    SELECT doctorid, name as "doctorName", doctor.contactinformation, s.specialtyname, doctor.specialtyid, d.departmentname, doctor.departmentid, hi.hospitalname, h.branchname, doctor.educationhistory, doctor.roomno
                    FROM Doctor 
                    JOIN HospitalBranch h ON Doctor.HospitalBranchID = h.HospitalBranchID
                    JOIN Hospital_Institute hi ON h.HospitalID = hi.HospitalID
                    JOIN Specialty s ON Doctor.specialtyid = s.specialtyid
                    JOIN Department d ON Doctor.DepartmentID = d.DepartmentID
                    WHERE h.HospitalBranchID = $1
                `,
                values: [branchid],
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.error('getBranchWiseDoctor error:', err);
            throw err;
        }
    }

    async getDoctorDetails(client: any, doctorid: any) {
        try {
            const query = {
                text: `
                    SELECT doctorid, name as "doctorName", doctor.contactinformation, s.specialtyname, doctor.specialtyid, d.departmentname, doctor.departmentid, hi.hospitalname, h.branchname, doctor.educationhistory, doctor.roomno
                    FROM Doctor 
                    JOIN HospitalBranch h ON Doctor.HospitalBranchID = h.HospitalBranchID
                    JOIN Hospital_Institute hi ON h.HospitalID = hi.HospitalID
                    JOIN Specialty s ON Doctor.specialtyid = s.specialtyid
                    JOIN Department d ON Doctor.DepartmentID = d.DepartmentID
                    WHERE doctorid = $1;`,
                values: [doctorid],
            };
            const responseData = await client.query(query);
            return responseData.rows[0];
        } catch (err) {
            console.log(err);
        }
    }
    addDoctor = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."doctor" (name, contactinformation, specialtyid, departmentid,hospitalid, hospitalbranchid, educationhistory, roomno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
                values: [data.doctorName, data.contactinformation, data.specialtyid, data.departmentid, data.hospitalid, data.hospitalbranchid, data.educationhistory, data.roomno],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }

     updateDoctor = async (client:any,data:any) => {
        try{
            const query = {
                text: 'UPDATE public."doctor" SET name = $1, contactinformation = $2, specialtyid = $3, departmentid = $4, educationhistory = $5, roomno = $6 WHERE doctorid = $7 RETURNING *;',
                values: [data.doctorName, data.contactinformation, data.specialtyid, data.departmentid, data.educationhistory, data.roomno, data.doctorid],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }

     deleteDoctor = async (client: any, doctorid: any) => {
        try {
          console.log("repo id", doctorid);
      
          // Step 1: Detach from User table
          await client.query({
            text: 'UPDATE public."User" SET doctor_id = NULL WHERE doctor_id = $1;',
            values: [doctorid],
          });
      
          // Step 2: Delete from doctor table
          const query = {
            text: 'DELETE FROM public."doctor" WHERE doctorid = $1 RETURNING *;',
            values: [doctorid],
          };
      
          const responseData = await client.query(query);
          return responseData.rows[0];
      
        } catch (err) {
          console.log("Delete error:", err);
          throw err;
        }
      };
      

     addSchedule = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."schedule" (doctorid, day, availability, startslot, endslot) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                values: [data.doctorid, data.day, data.availability, data.start_time, data.end_time],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }

     deleteSchedule = async (client: any, scheduleid: any) => {
        try {
      
          // Step 1: Update all appointments to remove reference
          await client.query({
            text: `UPDATE public."appointment" SET scheduleid = NULL WHERE scheduleid = $1;`,
            values: [scheduleid],
          });
      
          // Step 2: Now delete the schedule
          const query = {
            text: `DELETE FROM public."schedule" WHERE scheduleid = $1 RETURNING *;`,
            values: [scheduleid],
          };
      
          const responseData = await client.query(query);
          return responseData.rows[0];
        } catch (err) {
          console.error("Schedule delete error:", err);
          throw err;
        }
      };
      

     isScheduleExist = async (client: any, data: any): Promise<boolean> => {
        try {
          const query = {
            text: "SELECT 1 FROM schedule WHERE doctorid = $1 AND day = $2 LIMIT 1",
            values: [data.doctorid, data.day],
          };
          const responseData = await client.query(query);
          return responseData.rows.length > 0;
        } catch (err) {
          console.error('Error checking schedule existence:', err);
          return false; 
        }
      };
}

export default new DoctorRepo();