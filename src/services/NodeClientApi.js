/**
 * NodeClientApi.js
 *
 * Axios wrapper for the Node.js HFactor API.
 *
 * ─── Security model ───────────────────────────────────────────────────────
 *  • Session token is stored in:
 *      1. httpOnly cookie  `hfk_session`  (set by Node on login, auto-sent)
 *      2. Redux  Auth.Common.NodeSession.sessionToken  (mirrored here for the header)
 *  • Every protected request sends BOTH:
 *      Cookie:          hfk_session=<token>       (automatic)
 *      x-session-token: <token>                   (set manually below)
 *    The Node API rejects requests where cookie ≠ header (CSRF protection).
 *
 * ─── Encryption ───────────────────────────────────────────────────────────
 *  • /session/store  → encryptData / decryptData with useStatic = true (VITE_HFK / VITE_HFV)
 *  • all other routes → encryptData / decryptData with useStatic = false (C# keys from Redux)
 *
 * ─── Auto-refresh ─────────────────────────────────────────────────────────
 *  • If any response contains X-New-Session-Token header, the client
 *    silently swaps the token in Redux (rotateNodeSession).
 */

import axios from "axios";
import {
    encryptData,
    decryptData,
} from "../Security/NodeCrypto";
import { store } from "../Store/Store";
import { rotateNodeSession, clearNodeSession } from "../Store/Auth/AuthSlice";

// ─── Config ────────────────────────────────────────────────────────────────
const NODE_API_BASE_URL = import.meta.env.VITE_NODE_API_BASE_URL;

if (!NODE_API_BASE_URL) {
    console.error("❌ NodeClientApi: VITE_NODE_API_BASE_URL is not defined in .env");
}

/** Routes that use the static key (no session exists yet) */
const STATIC_ROUTES = ["/session/store"];

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateTraceId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

/** Read session token from Redux Auth slice */
function getSessionToken() {
    return store.getState()?.Auth?.Common?.NodeSession?.sessionToken ?? "";
}

function isStaticRoute(url) {
    return STATIC_ROUTES.some((r) => url.includes(r));
}

// ─── Main ──────────────────────────────────────────────────────────────────

/**
 * Makes an encrypted request to the Node.js HFactor API.
 *
 * @param {string}  url       - e.g. "/api/v1/session/store" or "/api/v1/users/me"
 * @param {object|null} body  - plain JS object (auto-encrypted)
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [method="GET"]
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} - decrypted response data
 */
export default async function NodeClientApi(
    url,
    body = null,
    method = "GET",
    signal = null
) {
    if (!NODE_API_BASE_URL) throw new Error("NODE_API_BASE_URL not configured");

    const useStatic = isStaticRoute(url);
    const sessionToken = getSessionToken();
    const traceId = generateTraceId();

    const headers = {
        "Content-Type": "application/json",
        "x-trace-id": traceId,
    };

    // Protected routes: send session token in header to match the httpOnly cookie
    if (!useStatic && sessionToken) {
        headers["x-session-token"] = sessionToken;
    }

    const config = {
        method,
        url: `${NODE_API_BASE_URL}${url}`,
        headers,
        withCredentials: true,   // ← sends the httpOnly hfk_session cookie automatically
    };

    if (signal) config.signal = signal;

    // ── Encrypt request body ─────────────────────────────────────────────
    const methodsWithBody = ["POST", "PUT", "PATCH"];
    if (methodsWithBody.includes(method.toUpperCase()) && body !== null) {
        const encrypted = encryptData(body, useStatic);

        if (!encrypted) throw new Error("NodeClientApi: encryption failed");
        config.data = { payload: encrypted };
    }

    // ── Execute ──────────────────────────────────────────────────────────
    const response = await axios(config);

    // ── Auto-refresh: swap token if Node rotated it ───────────────────────
    const newToken = response.headers?.["x-new-session-token"];
    const newExpiry = response.headers?.["x-new-session-expires"];
    if (newToken) {
        store.dispatch(rotateNodeSession({ sessionToken: newToken, expiresAt: newExpiry }));
        console.info("[NodeClientApi] Session auto-refreshed by server");
    }

    // ── Decrypt response ─────────────────────────────────────────────────
    const encryptedPayload = response?.data?.payload;

    if (!encryptedPayload) {
        // 204, health check, or plain responses
        return response?.data ?? null;
    }

    const decrypted = decryptData(encryptedPayload, useStatic);

    if (decrypted === null) {
        throw new Error("NodeClientApi: failed to decrypt response");
    }

    return decrypted;
}

// ─── Convenience API ───────────────────────────────────────────────────────

export const NodeApi = {
    /** GET – no body, response decrypted */
    get: (url, signal) =>
        NodeClientApi(url, null, "GET", signal),

    /** POST – body encrypted, response decrypted */
    post: (url, body, signal) =>
        NodeClientApi(url, body, "POST", signal),

    /** PUT – body encrypted, response decrypted */
    put: (url, body, signal) =>
        NodeClientApi(url, body, "PUT", signal),

    /** PATCH – body encrypted, response decrypted */
    patch: (url, body, signal) =>
        NodeClientApi(url, body, "PATCH", signal),

    /** DELETE – no body */
    delete: (url, signal) =>
        NodeClientApi(url, null, "DELETE", signal),
};

// ─── Session helpers (call these from your auth thunk) ────────────────────

/**
 * Call this on logout to revoke the session on the Node API.
 * Dispatches clearNodeSession to wipe Redux state.
 *
 * @returns {Promise<void>}
 */
export async function nodeLogout() {
    try {
        await NodeApi.delete("/api/v1/session/logout");
    } catch {
        // Continue even if the request fails — clear local state
    } finally {
        store.dispatch(clearNodeSession());
    }
}
