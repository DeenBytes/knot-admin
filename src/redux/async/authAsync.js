import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, apiJson, apiJsonAuth } from "../../api";

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await apiJson.post('/api/Admin/adminLogin', credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
);
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await apiJsonAuth.put('/api/Admin/adminUpdateProfile', credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
);
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (credentials, thunkAPI) => {
    try {
      const res = await apiJsonAuth.patch('/api/Admin/adminResetPassword', credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
);
export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async (credentials, thunkAPI) => {
    try {
      const res = await apiJson.post('/api/Admin/adminForgotPassword', credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Forgot password failed';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
)
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (credentials, thunkAPI) => {
    try {
      const res = await apiJson.patch('/api/Admin/adminChangePassword', credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Change password failed';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
)
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('user');
});
