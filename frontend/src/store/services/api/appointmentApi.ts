import { Api } from "./api";

export const appointmentApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    addAppointment: builder.mutation<any, {
      patientId: string;
      doctorId: string;
      date: string;
      ReceptionistID: string;
      HospitalBranchID: string;
    }>({
      query: (body) => ({
        url: "/users/appointment",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }),
      invalidatesTags: ["Appointment"]
    })
  }),
});

export const { useAddAppointmentMutation } = appointmentApi;
