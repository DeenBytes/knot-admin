import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, apiJsonAuth } from "../../api";

export const fetchBlogs = createAsyncThunk(
    'blog/fetchBlogs',
    async ({page, limit,search,status}, thunkAPI) => {
        try {
            const response = await apiJsonAuth.get(`/api/Admin/adminGetBlog?page=${page}&limit=${limit}&name=${search}&status=${status}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch blog list");
        }
    }
)
export const addBlog = createAsyncThunk(
    'blog/addBlog',
    async (data, thunkAPI) => {
        try {
            const res = await apiAuth.post('/api/Admin/adminAddBlog', data);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Blog creation failed';
            return thunkAPI.rejectWithValue(message); 
        }
    }
)
export const getSingleBlog = createAsyncThunk(
    'blog/getSingleBlog',
    async (id, thunkAPI) => {
        try {
            const response = await apiJsonAuth.get(`/api/Admin/adminGetBlogById/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch blog details");
        }
    }
)

export const deleteBlog = createAsyncThunk(
    'blog/deleteBlog',
    async (id, thunkAPI) => {
        try {
            const res = await apiJsonAuth.delete(`/api/Admin/adminDeleteBlog/${id}`);
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Blog deletion failed';
            return thunkAPI.rejectWithValue(message); 
        }
    }
)