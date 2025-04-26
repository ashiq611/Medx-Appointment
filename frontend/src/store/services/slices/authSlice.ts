import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        UserloggedIn: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.jwtToken;
        },

        UserloggedOut: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;

        },
    },
});
export const { UserloggedIn, UserloggedOut } = authSlice.actions;
export default authSlice.reducer;