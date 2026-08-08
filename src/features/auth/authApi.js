import { baseApi } from '@/lib/api/baseQuery';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),

    // POST /auth/register
    register: builder.mutation({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),

    // GET /me  →  authMiddleware → getUser
    getCurrentUser: builder.query({
      query: () => '/me',
      // API response shape: { success, data: { id, firstName, lastName, username, email, role, ... } }
      transformResponse: (response) => response?.data ?? response,
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    // POST /logout  →  authMiddleware → logoutUser
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      // Wipe the cached user profile after server-side logout
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),

    // POST /auth/password/request-otp
    requestPasswordOtp: builder.mutation({
      query: (payload) => ({
        url: '/auth/password/request-otp',
        method: 'POST',
        body: payload, // { email }
      }),
    }),

    // POST /auth/password/change
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/password/change',
        method: 'POST',
        body: payload, // { email, otp, newPassword }
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
  useRequestPasswordOtpMutation,
  useChangePasswordMutation,
} = authApi;
