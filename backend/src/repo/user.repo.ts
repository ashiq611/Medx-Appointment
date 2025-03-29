class UserRopo {
  async createAppointment(client: any,user: any) {
    try {

const {patientId, doctorId, date,ReceptionistID, HospitalBranchID,ScheduleID} = user;

        const query = {
            text: `INSERT INTO Appointment (AppointmentDate, Status, PatientID, DoctorID, ReceptionistID, HospitalBranchID,ScheduleId) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            values: [date, 'Scheduled', patientId, doctorId, ReceptionistID, HospitalBranchID,ScheduleID],
        };
      const result = await client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }

    
  }
  
}

export default new UserRopo();