// src/store/services/api/doctorApi.ts
import { Api } from './api';

export const doctorApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getBranchDoctors: builder.query<any, string>({
      query: (branchId) => `users/get-branch-wise-doctor/${branchId}`,
      providesTags: ["Doctor"],
    }),
    getDoctorDetails: builder.query<any, string>({
        query: (doctorId) => `users/doctor-details/${doctorId}`,
        providesTags: ["Doctor"],
    }),
    addDoctor: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-doctor",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Doctor"],
    })
  }),
});

export const { useGetBranchDoctorsQuery, useGetDoctorDetailsQuery , useAddDoctorMutation} = doctorApi;
