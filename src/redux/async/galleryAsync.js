import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, apiJsonAuth } from "../../api";

export const fetchGallery = createAsyncThunk(
    'gallery/fetchGallery',
    async (data, thunkAPI) => {
        try {
            const res = await apiJsonAuth.get(`/api/Admin/adminGetGallery?page=${data?.page}&limit=${data?.limit}${data?.name ? `&name=${data.name}` : ''}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to fetch gallery';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const addGallery = createAsyncThunk(
    'gallery/addGallery',
    async (data, thunkAPI) => {
        try {
            const res = await apiAuth.post('/api/Admin/adminAddGallery', data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to add gallery';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const updateGallery = createAsyncThunk(
    'gallery/updateGallery',
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await apiAuth.put(`/api/Admin/adminUpdateGallery/${id}`, data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to update gallery';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    }
)
export const deleteGallery = createAsyncThunk(
    'gallery/deleteGallery',
    async (id, thunkAPI) => {
        try {
            const res = await apiJsonAuth.delete(`/api/Admin/adminDeleteGallery/${id}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to delete gallery';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const fetchCategory = createAsyncThunk(
    'gallery/fetchCategory',
    async (data, thunkAPI) => {
        try {
            const res = await apiJsonAuth.get(`/api/Admin/adminGetCategoryList?page=${data?.page}&limit=${data?.limit}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to fetch category';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const addCategory = createAsyncThunk(
    'gallery/addCategory',
    async (data, thunkAPI) => {
        try {
            const res = await apiJsonAuth.post('/api/Admin/addCategory', data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to add category';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const updateCategory = createAsyncThunk(
    'gallery/updateCategory',
    async ({ id, categoryName }, thunkAPI) => {
        try {
            const res = await apiJsonAuth.put(`/api/Admin/adminUpdateCategory/${id}`, {categoryName});
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to update category';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })

export const deleteCategory = createAsyncThunk(
    'gallery/deleteCategory',
    async (id, thunkAPI) => {
        try {
            const res = await apiJsonAuth.delete(`/api/Admin/adminDeleteCategory/${id}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to delete category';
            return thunkAPI.rejectWithValue(message); // Properly handle error
        }
    })