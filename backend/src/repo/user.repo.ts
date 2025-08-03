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
  async getAppointmentList(client: any,patientid: any) {
    try {
      const query = {
        text: `SELECT a.AppointmentID, a.AppointmentDate, a.Status, p.PatientID, p.Name AS PatientName, p.ContactInformation AS PatientContact, d.DoctorID, d.Name AS DoctorName, d.ContactInformation AS DoctorContact, b.HospitalBranchID, b.BranchName FROM Appointment a LEFT JOIN Patient p ON a.PatientID = p.PatientID LEFT JOIN Doctor d ON a.DoctorID = d.DoctorID LEFT JOIN HospitalBranch b ON a.HospitalBranchID = b.HospitalBranchID WHERE a.PatientID = $1;`,
        values: [patientid],
      };
      const result = await client.query(query);
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }
  
}

export default new UserRopo();