import { createSlice } from '@reduxjs/toolkit';
import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";

const initialState = {
  LogResponce: { data: [], isLoading: false, error: null, Success: null },
  Common: {
    SelectedRole: "",
    SelectedClientCode: "",
    SelectedClientLabel: "",
    SelectedClientContractCode: "",
    SelectedClientContractLabel: "",
    SelectedMonth: "",
    theme: 'light',
    NodeSession: {
      sessionToken: null,
      expiresAt: null
    }
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.Common.SelectedClientCode = action.payload;
    },
    setSelectedClientLabel: (state, action) => {
      state.Common.SelectedClientLabel = action.payload;
    },
    setSelectedClientContract: (state, action) => {
      state.Common.SelectedClientContractCode = action.payload;
    },
    setSelectedClientContractLabel: (state, action) => {
      state.Common.SelectedClientContractLabel = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.Common.SelectedMonth = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.Common.SelectedRole = action.payload;
    },
    setTheme: (state, action) => {
      state.Common.theme = action.payload;
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    resetAuth: (state) => {
      return initialState;
    },
    setNodeSession: (state, action) => {
      state.Common.NodeSession.sessionToken = action.payload?.sessionToken ?? null;
      state.Common.NodeSession.expiresAt = action.payload?.expiresAt ?? null;
    },
    rotateNodeSession: (state, action) => {
      if (action.payload?.sessionToken) state.Common.NodeSession.sessionToken = action.payload.sessionToken;
      if (action.payload?.expiresAt) state.Common.NodeSession.expiresAt = action.payload.expiresAt;
    },
    clearNodeSession: (state) => {
      state.Common.NodeSession.sessionToken = null;
      state.Common.NodeSession.expiresAt = null;
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

export const {
  setSelectedClient,
  setSelectedClientLabel,
  setSelectedClientContract,
  setSelectedClientContractLabel,
  setSelectedMonth,
  setSelectedRole,
  setTheme,
  resetAuth,
  setNodeSession,
  rotateNodeSession,
  clearNodeSession
} = authSlice.actions;
export default authSlice.reducer;
