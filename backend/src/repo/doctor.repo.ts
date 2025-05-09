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
                    SELECT doctorid, name as "doctorName", doctor.contactinformation, s.specialtyname, d.departmentname, hi.hospitalname, h.branchname
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
                    SELECT doctorid, name as "doctorName", doctor.contactinformation, s.specialtyname, d.departmentname, hi.hospitalname, h.branchname
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
                values: [data.name, data.phone_number, data.specialtyid, data.departmentid, data.hospitalid, data.hospitalbranchid, data.educationhistory, data.roomno],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
}

export default new DoctorRepo();