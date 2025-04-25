import { Api } from "./api";
const urlPrefix = "auth";
export const authApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { phone_number: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth'],
    }),
    userInfo: builder.query<any, void>({
      query: () => ({
        url: 'auth/status',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    })
    })

export const { useLoginMutation, useUserInfoQuery, useLogoutMutation } = authApi
// export const { endpoints } = authApi
