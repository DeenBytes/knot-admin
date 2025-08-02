import { createSlice } from "@reduxjs/toolkit";
import { addCategory, addGallery, deleteCategory, deleteGallery, fetchCategory, fetchGallery, updateCategory, updateGallery } from "../async/galleryAsync";

const gallerySlice = createSlice({
    name: 'gallery',
    initialState: {
        galleryItems: [],
        categories: [],
        catLoading: false,
        catError: null,
        catTotalPages: 0,
        loading: false,
        error: null,
        totalPages: 0
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGallery.fulfilled, (state, action) => {
                state.loading = false;   
                state.galleryItems = action.payload?.result || [];
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchGallery.rejected, (state, action) => { 
                state.galleryItems=action?.error.message ==="Rejected" ? [] : state.galleryItems
                state.totalPages = 0;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGallery.fulfilled, (state, action) => {
                state.loading = false;
                // state.galleryItems = [...state.galleryItems, action.payload.result];
            })
            .addCase(addGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGallery.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategory.pending, (state) => {
                state.catLoading = true;
                state.catError = null;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.catLoading = false;
                state.categories = action.payload?.result;
                state.catTotalPages = action.payload.totalPages;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.categories=action?.error.message ==="Rejected" ? [] : state.categories
                state.catTotalPages = 0;
                state.catLoading = false;
                state.catError = action.payload;
            })
            .addCase(deleteGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGallery.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCategory.pending, (state) => {
                state.catLoading = true;
                state.catError = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.catLoading = false;
                state.categories = [...state.categories, action.payload.result];
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.catLoading = false;
                state.catError = action.payload;
            })
            .addCase(updateCategory.pending, (state) => {
                state.catLoading = true;
                state.catError = null;
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.catLoading = false;
               
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.catLoading = false;
                state.catError = action.payload;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.catLoading = true;
                state.catError = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.catLoading = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.catLoading = false;
                state.catError = action.payload;
            })
    }

    
})
export default gallerySlice.reducer;