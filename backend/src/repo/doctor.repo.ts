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
    async getDoctorSchedule(client: any, doctorId: any) {
        try {
            const query = {
                text: "SELECT * FROM public.\"Appointment\" WHERE DoctorID = $1",
                values: [doctorId],
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }
}

export default new DoctorRepo();