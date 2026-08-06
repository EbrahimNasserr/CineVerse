import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY   = 'auth_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_KEY    = 'auth_user';

/** Read persisted credentials from localStorage (safe for SSR). */
function loadFromStorage() {
  if (typeof window === 'undefined') return { token: null, refreshToken: null, user: null };
  try {
    return {
      token:        localStorage.getItem(TOKEN_KEY)   ?? null,
      refreshToken: localStorage.getItem(REFRESH_KEY) ?? null,
      user:         JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'),
    };
  } catch {
    return { token: null, refreshToken: null, user: null };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage(),
  reducers: {
    setCredentials(state, action) {
      // API response shape: { id, firstName, lastName, username, email, role, accessToken, refreshToken }
      const { accessToken, refreshToken, ...user } = action.payload;
      state.token        = accessToken;
      state.refreshToken = refreshToken;
      state.user         = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY,   accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);
        localStorage.setItem(USER_KEY,    JSON.stringify(user));
      }
    },
    logout(state) {
      state.token        = null;
      state.refreshToken = null;
      state.user         = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
