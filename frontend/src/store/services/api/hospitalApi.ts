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
  }),
});

export const { useGetBranchesQuery } = hospitalApi;
