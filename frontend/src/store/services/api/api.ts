// store/services/myApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Api = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`, 
    credentials: "include"
  }),
  refetchOnMountOrArgChange: true,
  tagTypes: ['Auth', 'Appointment','Branch', 'SpecilityDepartment', 'Doctor', 'User'],
  endpoints: () => ({}),
});

// Export hooks
// export const { useGetPostsQuery, useLoginMutation } = Api;
