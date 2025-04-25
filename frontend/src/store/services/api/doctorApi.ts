// src/store/services/api/doctorApi.ts
import { Api } from './api';

export const doctorApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getBranchDoctors: builder.query<any, string>({
      query: (branchId) => `users/get-branch-wise-doctor/${branchId}`,
    }),
    getDoctorDetails: builder.query<any, string>({
        query: (doctorId) => `users/doctor-details/${doctorId}`,
    }),
  }),
});

export const { useGetBranchDoctorsQuery, useGetDoctorDetailsQuery } = doctorApi;
