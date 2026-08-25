import {
  createSlice,
} from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser
    ? JSON.parse(savedUser)
    : null,

  isAuthenticated: Boolean(savedUser),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
    },

    registerSuccess: (state, action) => {
  state.user = action.payload;
  state.isAuthenticated = true;

  localStorage.setItem(
    "user",
    JSON.stringify(action.payload)
  );
},
  },
});

export const {
  loginSuccess,
  logout,
  registerSuccess,
} = authSlice.actions;

export default authSlice.reducer;