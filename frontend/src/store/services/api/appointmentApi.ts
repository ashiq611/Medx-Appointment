import { Api } from "./api";

export const appointmentApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    addAppointment: builder.mutation<any, {
      patientId: string;
      doctorId: string;
      date: string;
      ReceptionistID: string;
      HospitalBranchID: string;
      scheduleid: string;
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
      transformResponse: (response: any) => response.data, 
      invalidatesTags: ["Appointment"]
  }),
  HospitalAddAppointment: builder.mutation<any, {
    patientname: string;
    phone_number: string;
    doctorId: string;
    date: string;
    ReceptionistID: string;
    HospitalBranchID: string;
    scheduleid: string;
  }>({
    query: (body) => ({
      url: "/admin/appointment",
      method: "POST",
      body,
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }),
    transformResponse: (response: any) => response.data, 
    invalidatesTags: ["Appointment"]
  }),
  getAppointments: builder.query<any, { doctorId: string; date: string }>({
    query: ({ doctorId, date }) => 
      `admin/get-appointment?doctorid=${doctorId}&date=${date}`,
  }),
})
});

export const { useAddAppointmentMutation, useHospitalAddAppointmentMutation, useGetAppointmentsQuery } = appointmentApi;
