class UserRopo {
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
            values: [user.name, user.phone_number],
        };  
      const result = await client.query(query);
      return result.rows[0];  
    } catch (err) {
      console.log(err);
    }

  }
  
}

export default new UserRopo();