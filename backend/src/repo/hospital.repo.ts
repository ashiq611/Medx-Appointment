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
          console.log("branch", data)
            const query = {
                text: `INSERT INTO HospitalBranch (branchname, location,contactinformation, hospitalid) VALUES ($1, $2, $3, $4)  RETURNING *;`,
                values: [data.branchname, data.location, data.contactinformation, data.HospitalID],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
    
      }

      async updateBranch(client: any,data: any) {
        try { 
            const query = {
                text: `UPDATE HospitalBranch SET branchname = $1, location = $2, contactinformation = $3 WHERE hospitalbranchid = $4 RETURNING *;`,
                values: [data.branchname, data.location, data.contactinformation, data.hospitalbranchid],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
      }

      async deleteBranch(client: any,branchid: any) {
        try {
            const query = {
                text: `DELETE FROM HospitalBranch WHERE hospitalbranchid = $1 RETURNING *;`,
                values: [branchid],
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

      async updateSpeciality(client: any,data: any) {
        try { 
            const query = {
                text: `UPDATE specialty SET specialtyname = $1 WHERE specialtyid = $2 RETURNING *;`,
                values: [data.specialtyname, data.specialtyid],
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

      async updateDepartment(client: any,data: any) {
        try { 
            const query = {
                text: `UPDATE department SET departmentname = $1 WHERE departmentid = $2 RETURNING *;`,
                values: [data.departmentname, data.departmentid],
            };  
          const result = await client.query(query);
          return result.rows[0];  
        } catch (err) {
          console.log(err);
        }
      }

}

export default new HospitalRepo();