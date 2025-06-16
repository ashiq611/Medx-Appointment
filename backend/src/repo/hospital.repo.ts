class HospitalRepo {
    async getBranch(client: any) {
        try {
            const query = {
                text: "SELECT * FROM HospitalBranch join Hospital_Institute h on HospitalBranch.HospitalID = h.HospitalID",
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }
    async createAppointment(client: any,user: any) {
        try {
    
    const {patientId, doctorId, date,ReceptionistID, HospitalBranchID,ScheduleID} = user;
    
            const query = {
                text: `INSERT INTO Appointment (AppointmentDate, Status, PatientID, DoctorID, ReceptionistID, HospitalBranchID,ScheduleId) VALUES ($1, $2, $3, $4, $5, $6, $7)  RETURNING *;`,
                values: [date, 'Scheduled', patientId, doctorId, ReceptionistID, HospitalBranchID,ScheduleID],
            };
          const result = await client.query(query);
          return result.rows[0];
        } catch (err) {
          console.log(err);
        }
    
        
    }
    async createPatient(client: any,user: any) {
        try { 
    
            const query = {
                text: `INSERT INTO Patient (name, contactinformation) VALUES ($1, $2)  RETURNING patientid;`,
                values: [user.name, user.contactinformation],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
    
      }
      async addBranch(client: any,data: any) {
        try { 
            const query = {
                text: `INSERT INTO HospitalBranch (branchname, location,contactinformation, hospitalid) VALUES ($1, $2, $3, $4)  RETURNING *;`,
                values: [data.BranchName, data.Location, data.contactinformation, data.HospitalID],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
    
      }

      async getHospitalId(client: any, hospitalbranchid: any) {
        try {
            const query = {
                text: "SELECT hospitalid FROM HospitalBranch WHERE hospitalbranchid = $1",
                values: [hospitalbranchid],
            };
            const responseData = await client.query(query);
            return responseData.rows[0].hospitalid;
        } catch (err) {
            console.log(err);
        }
    }

    async getSpeciality(client: any) {
        try {
            const query = {
                text: "SELECT * FROM specialty",
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }

    async getDepartment(client: any) {
        try {
            const query = {
                text: "SELECT * FROM department",
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }

    async addSpeciality(client: any,data: any) {
        try { 
            const query = {
                text: `INSERT INTO specialty (specialtyname) VALUES ($1)  RETURNING *;`,
                values: [data.specialtyname],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
    
      }

      async addDepartment(client: any,data: any) {
        try { 
            const query = {
                text: `INSERT INTO department (departmentname) VALUES ($1)  RETURNING *;`,
                values: [data.departmentname],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
    
      }

}

export default new HospitalRepo();