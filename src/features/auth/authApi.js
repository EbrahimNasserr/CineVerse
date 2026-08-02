import { baseApi } from '@/lib/api/baseQuery';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
