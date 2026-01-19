import { createSlice } from '@reduxjs/toolkit';
import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";

const initialState = {
  LogResponce: { data: [], isLoading: false, error: null, Success: null },
  Common: { SelectedRole:"",SelectedClient: "", SelectedClientContract: "", SelectedMonth: "" }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.Common.SelectedClient = action.payload;
    },
    setSelectedClientContract: (state, action) => {
      state.Common.SelectedClientContract = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.Common.SelectedMonth = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.Common.SelectedRole = action.payload;
    },
    resetAuth: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GET_AUTH_REQUEST, (state) => {
        state.LogResponce.isLoading = true;
        state.LogResponce.error = null;
        state.LogResponce.Success = null;
      })
      .addCase(GET_AUTH_SUCCESS, (state, action) => {
        state.LogResponce.isLoading = false;
        state.LogResponce.data = action.payload;
        state.LogResponce.error = null;
        state.LogResponce.Success = true;
      })
      .addCase(GET_AUTH_FAILURE, (state, action) => {
        state.LogResponce.isLoading = false;
        state.LogResponce.error = action.payload;
        state.LogResponce.Success = false;
      })
      .addCase("RESET_AUTH", (state) => {
        return initialState;
      });
  }
});

export const { setSelectedClient, setSelectedClientContract,setSelectedMonth,setSelectedRole, resetAuth } = authSlice.actions;
export default authSlice.reducer;
