import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  role: null,
  userId: null,
};

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/admin/signup', userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return rejectWithValue(error.response?.data?.error || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
<<<<<<< Updated upstream
'auth/login',
async ({ credentials, pathname }, { rejectWithValue }) => {
  try {
    const role = pathname.includes('/admin/') ? 'admin' : 'judge';
    const loginUrl = `api/v1/${role}/login`;

    const response = await axiosInstance.post(loginUrl, credentials);
    
    const { token: tokenData } = response.data;
    if (role === "judge") {
      const { token, judge, role: responseRole } = tokenData;
      setAuthToken(token);
      localStorage.setItem('role', responseRole);
      localStorage.setItem('userId', judge.id);
      return {
        token,
        user: judge,
        role: responseRole,
        userId: judge.id
      };
    } else if (role === "admin") {
      const { token, admin, role: responseRole } = tokenData;
      setAuthToken(token);
      localStorage.setItem('role', responseRole);
      localStorage.setItem('userId', admin.id);
      return {
        token,
        user: admin,
        role: responseRole,
        userId: admin.id
=======
  'auth/login',
  async ({ credentials, pathname }, { rejectWithValue }) => {
    try {
      const role = pathname.includes('/admin/') ? 'admin' : 'judge';
      const loginUrl = `/auth/${role}/login`;

      const response = await axiosInstance.post(loginUrl, credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);

      return {
        user,
        role: user.role,
        userId: user.id
>>>>>>> Stashed changes
      };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!accessToken || !role || !userId) {
        return rejectWithValue('No auth data found');
      }

      // Fetch user data if needed
      let userData = null;
      if (role === 'judge') {
        const response = await axiosInstance.get(`/judges/${userId}`);
        userData = response.data;
      } else if (role === 'admin') {
        const response = await axiosInstance.get(`/admin/${userId}`);
        userData = response.data;
      }

      return {
        role,
        userId,
        user: userData || { id: userId },
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Check auth state error:', error);
      localStorage.clear();
      return rejectWithValue('Session expired');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.clear();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.role = action.payload.role;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.role = null;
        state.user = null;
        state.userId = null;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.role = action.payload.role;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(checkAuthState.rejected, () => ({
        ...initialState,
        loading: false
      }));
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;