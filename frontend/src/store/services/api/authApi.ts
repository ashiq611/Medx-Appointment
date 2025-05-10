
import { Api } from "./api";
export const authApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, { name: string; phone_number: string; password: string }>({
      query: (body) => ({
        url: 'auth/register',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<any, { phone_number: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
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

export const { useRegisterMutation, useLoginMutation, useUserInfoQuery, useLogoutMutation } = authApi
// export const { endpoints } = authApi
