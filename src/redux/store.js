import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import eventReducer from './slices/eventSlice.js';
import galleryReducer from './slices/gallerySlice.js';
import blogReducer from './slices/blogSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    gallery: galleryReducer,
    blog: blogReducer
  },
});

export default store;
