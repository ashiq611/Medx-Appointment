class UserRopo {
  async createAppointment(client: any,user: any) {
    try {

const {patientId, doctorId, date, time,ReceptionistID, HospitalBranchID} = user;

        const query = {
            text: `INSERT INTO Appointment (AppointmentDate, Status, PatientID, DoctorID, ReceptionistID, HospitalBranchID) VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [`${date} ${time}`, 'Scheduled', patientId, doctorId, ReceptionistID, HospitalBranchID],
        };
      const result = await client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }

    
  }
  
}

export default new UserRopo();