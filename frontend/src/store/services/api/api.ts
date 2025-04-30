// store/services/myApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Api = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3006/api/v1/' ,
    credentials: "include"
  }),
  refetchOnMountOrArgChange: true,
  tagTypes: ['Auth', 'Appointment','Branch'],
  endpoints: (builder) => ({}),
//   (builder) => ({
//     getPosts: builder.query<any[], void>({
//       query: () => 'posts',
//     }),
//     login: builder.mutation<any, { phone_number: string; password: string }>({
//         query: (body) => ({
//           url: 'auth/login',
//           method: 'POST',
//           body
//         })
//     }),
//   }),
});

// Export hooks
// export const { useGetPostsQuery, useLoginMutation } = Api;
