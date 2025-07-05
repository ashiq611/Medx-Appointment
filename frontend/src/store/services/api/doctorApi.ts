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
    }),
    updateDoctor: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/update-doctor",
        method: "PUT",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Doctor"],
    }),
    deleteDoctor: builder.mutation<any, any>({
      query: (doctorid) => ({
        url: `/admin/delete-doctor/${doctorid}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Doctor"],
    }),
    addSchedule: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-schedule",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Doctor"],
    }),
    deleteSchedule: builder.mutation<any, string>({
      query: (scheduleid) => ({
        url: `/admin/delete-schedule/${scheduleid}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const { useGetBranchDoctorsQuery, useGetDoctorDetailsQuery , useAddDoctorMutation, useUpdateDoctorMutation, useDeleteDoctorMutation, useAddScheduleMutation, useDeleteScheduleMutation} = doctorApi;
