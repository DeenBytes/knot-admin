import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, apiJsonAuth } from "../../api";

export const fetchEvents = createAsyncThunk(
    'event/fetchEvents',
    async ({ page, name }, thunkAPI) => {
        try {
            const response = await apiJsonAuth.get(`/api/Admin/adminGetEvent?page=${page}&name=${name}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch event list");
        }
    }
);

export const addEvent = createAsyncThunk(
    'event/addEvent',
    async (data, thunkAPI) => {
        try {
            const res = await apiAuth.post('/api/Admin/adminAddEvent', data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Event creation failed';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    }
);

export const getSingleEvent = createAsyncThunk(
    'event/getSingleEvent',
    async (id, thunkAPI) => {
        try {
            const res = await apiJsonAuth.get(`/api/Admin/adminGetEventById/${id}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Event fetch failed';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    }
);

export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await apiAuth.put(`/api/Admin/adminUpdateEvent/${id}`, data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Event update failed';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    }
)
export const deleteEvent = createAsyncThunk(
    'event/deleteEvent',
    async (id, thunkAPI) => {
        try {
            const res = await apiAuth.delete(`/api/Admin/adminDeleteEvent/${id}`);
            return {
                message: res.data.message || 'Event deleted successfully',
                result: { id },
            };
        } catch (err) {
            const message = err?.response?.data?.message || 'Event deletion failed';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    }
);
export const getAboutData = createAsyncThunk(
  'event/getAboutData',
  async (_, thunkAPI) => {
    try {
      const res = await apiJsonAuth.get('/api/Admin/adminGetAboutUs');
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to fetch about data';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
)
export const addAboutData = createAsyncThunk(
  'event/addAboutData',
  async (data, thunkAPI) => {
    try {
      const res = await apiAuth.post('/api/Admin/adminAddAboutUs', data);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add about data';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
)
export const deleteAboutData = createAsyncThunk(
  'event/deleteAboutData',
  async (id, thunkAPI) => {
    try {
      const res = await apiJsonAuth.delete(`/api/Admin/adminDeleteAboutUs/${id}`);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to delete about data';
      return thunkAPI.rejectWithValue(message); // Properly handle error
    }
  }
)
