import { Api } from "./api";

export const hospitalApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<any[], void>({
      query: () => ({
        url: "users/get-all-hospital", // adjust if different
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: any) => response.data, // extract `data` array
      providesTags: ["Branch"],
    }),
    addBranch: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-branch",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Branch"],
    }),
    updateBranch: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/update-branch",
        method: "PUT",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Branch"],
    }),
    deleteBranch: builder.mutation<any, string>({
      query: (branchid) => ({
        url: `/admin/delete-branch/${branchid}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Branch"],
    }),
    getSpecilityDepartment: builder.query<any[], void>({
      query: () => ({
        url: "/admin/get-speciality-department",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["SpecilityDepartment"],
    }),
    addUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-user",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    getUser: builder.query<any[], void>({
      query: () => ({
        url: "/admin/get-all-admin-reception",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["User"],
    }),
    addDepartment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-department",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SpecilityDepartment"],
    }),
    addSpeciality: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/add-speciality",
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SpecilityDepartment"],
    }),
  }),
});

export const { useGetBranchesQuery, useAddBranchMutation, useUpdateBranchMutation, useDeleteBranchMutation, useGetSpecilityDepartmentQuery, useAddUserMutation, useGetUserQuery, useAddDepartmentMutation, useAddSpecialityMutation } = hospitalApi;
