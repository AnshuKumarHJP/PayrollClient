/**
 * NodeSessionSlice.js
 *
 * Redux slice for the Node.js API session state.
 *
 * Populated once after POST /api/v1/session/store succeeds.
 * Read by NodeCrypto.js and NodeClientApi.js on every request.
 *
 * Stored in sessionStorage (not persisted to localStorage).
 *
 * State shape:
 * {
 *   sessionToken: string | null,   ← sent as x-session-token header
 *   expiresAt:    string | null,   ← ISO datetime, used to trigger refresh
 *   cSharpKey:    string | null,   ← authData.Key   (hex AES key from C# API)
 *   cSharpVector: string | null,   ← authData.Vector (hex AES IV from C# API)
 * }
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sessionToken: null,
    expiresAt: null,
    cSharpKey: null,
    cSharpVector: null,
};

const nodeSessionSlice = createSlice({
    name: "nodeSession",
    initialState,
    reducers: {
        /**
         * Called once after /session/store succeeds.
         * payload: { sessionToken, expiresAt, cSharpKey, cSharpVector }
         */
        setNodeSession: (state, action) => {
            state.sessionToken = action.payload.sessionToken ?? null;
            state.expiresAt = action.payload.expiresAt ?? null;
            state.cSharpKey = action.payload.cSharpKey ?? null;
            state.cSharpVector = action.payload.cSharpVector ?? null;
        },

        /**
         * Called when the Node API returns X-New-Session-Token header
         * (auto-refresh) or after POST /session/refresh succeeds.
         * payload: { sessionToken, expiresAt }
         */
        rotateNodeSession: (state, action) => {
            state.sessionToken = action.payload.sessionToken ?? state.sessionToken;
            state.expiresAt = action.payload.expiresAt ?? state.expiresAt;
            // cSharpKey / cSharpVector stay the same — only the token is rotated
        },

        /** Called on logout — wipes the whole session */
        clearNodeSession: () => initialState,
    },
});

export const { setNodeSession, rotateNodeSession, clearNodeSession } =
    nodeSessionSlice.actions;

export default nodeSessionSlice.reducer;
