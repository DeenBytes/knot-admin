import { createSlice } from "@reduxjs/toolkit";
import { addBlog, deleteBlog, fetchBlogs, getSingleBlog } from "../async/blogAsync";

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        blogItems: [],
        blog: {},
        singleLoading: false,
        singleError: null,
        loading: false,
        error: null,
        totalPages: 0
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogItems = action.payload?.result || [];
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.blogItems = [];
                state.error = action.payload;
            })
            .addCase(addBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBlog.fulfilled, (state, ) => {
                state.loading = false;
            })
            .addCase(addBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleBlog.pending, (state) => {
                state.singleLoading = true;
                state.singleError = null;
            })
            .addCase(getSingleBlog.fulfilled, (state, action) => {
                state.singleLoading = false;
                state.blog = action.payload.result;
            })
            .addCase(getSingleBlog.rejected, (state, action) => {
                state.singleLoading = false;
                state.singleError = action.payload;
            })
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state, ) => {
                state.loading = false;
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});
export default blogSlice.reducer