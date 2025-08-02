import { createSlice } from '@reduxjs/toolkit';
import { resetPassword, loginUser, logoutUser, updateUser, sendEmailOtp, changePassword } from '../async/authAsync';

const storedUser = localStorage.getItem('user');
const initialState = {
    user: storedUser !== undefined ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    darkMode: localStorage.getItem('theme') === null ? true : JSON.parse(localStorage.getItem('theme')),
    colorCode: localStorage.getItem('colorCode') || '#C5A572',
};

if (initialState.darkMode) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

document.documentElement.style.setProperty('--color-primary', initialState.colorCode);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('theme', JSON.stringify(state.darkMode));
            document.documentElement.classList.toggle('dark', state.darkMode);
        },
        setColorCode: (state, action) => {
            state.colorCode = action.payload;
            document.documentElement.style.setProperty('--color-primary', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.result;
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.result;
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state,) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendEmailOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEmailOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendEmailOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { toggleDarkMode, setColorCode } = authSlice.actions;
export default authSlice.reducer;
