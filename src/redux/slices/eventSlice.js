import { createSlice } from "@reduxjs/toolkit";
import { addAboutData, addEvent, deleteAboutData, deleteEvent, fetchEvents, getAboutData, getSingleEvent, updateEvent } from "../async/eventAsync";

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        events: [],
        aboutData: null,
        singleEvent: {},
        singleLoading: false,
        singleError: null,
        totalPages: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload?.result;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = [...state.events, action.payload.result];
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleEvent.pending, (state) => {
                state.singleLoading = true;
                state.singleError = null;
            })
            .addCase(getSingleEvent.fulfilled, (state, action) => {
                state.singleLoading = false;
                state.singleEvent = action.payload?.result;
            })
            .addCase(getSingleEvent.rejected, (state, action) => {
                state.singleLoading = false;
                state.singleError = action.payload;
            })
            .addCase(updateEvent.pending, (state,action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                // state.events = state.events.map(event => event.id === action.payload?.result?.id ? action.payload?.result : event);
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload?.result?.id;

                if (deletedId) {
                    state.events = state.events.filter(event => event.id !== deletedId);
                }

            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAboutData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAboutData.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutData = action.payload?.result;
            })
            .addCase(getAboutData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAboutData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAboutData.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutData = action.payload?.result;
            })
            .addCase(addAboutData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAboutData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAboutData.fulfilled, (state, ) => {
                state.loading = false;
                state.aboutData = null;
            })
            .addCase(deleteAboutData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
})
export default eventSlice.reducer