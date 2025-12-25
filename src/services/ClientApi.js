import axios from "axios";
import { persistor, store } from "../Store/Store";
import { resetGlobalStore } from "../Store/Slices/GlobalSlice";
import { resetGlobalSaveStore } from "../Store/Slices/GlobalSaveSlice";
import { navigateTo } from "./navigationService";

/* ----------------------------------------------------
   HANDLE 401 SESSION EXPIRED
---------------------------------------------------- */
async function handleUnauthorized() {
  try {
    const dispatch = store.dispatch;

    // Clear Redux stores
    dispatch({ type: "RESET_AUTH" });
    dispatch(resetGlobalStore());
    dispatch(resetGlobalSaveStore());

    // Clear storage
    sessionStorage.clear();
    localStorage.clear();

    // Clear persisted Redux
    if (persistor) {
      await persistor.flush();
      await persistor.purge();
    }

    // Redirect to session-expired page
    navigateTo("/session-expired");

  } catch (e) {
    console.error("Error handling unauthorized:", e);
  }
}

/* ----------------------------------------------------
   RESPONSE CHECKER
---------------------------------------------------- */
export async function checkStatus(res) {
  // -----------------------------------------
  // SUCCESS (2xx)
  // -----------------------------------------
  if (res?.status >= 200 && res?.status < 300) {

    const data = res?.data;

    // BACKEND — UNAUTHORIZED but sent inside JSON (fake 200)
    const backendUnauthorized =
      data?.Message === "Unauthorized action" ||
      data?.Message === "Token expired" ||
      data?.Message === "Session expired" ||
      data?.Status === false && typeof data?.Result === "undefined";

    if (backendUnauthorized) {
      await handleUnauthorized();
    }

    // VALID SUCCESS
    return res;
  }

  // -----------------------------------------
  // AXIOS ERROR (occurs in catch)
  // -----------------------------------------
  const err = res?.response || res;

  const httpStatus = err?.status;

  // ----------- 401 (REAL HTTP UNAUTHORIZED) -----------
  if (httpStatus === 401) {
    await handleUnauthorized();
  }

  // ----------- CLIENT ERRORS (400–499) -----------
  if (httpStatus >= 400 && httpStatus < 500) {
    throw err?.data || err;
  }

  // ----------- SERVER ERRORS (500–599) -----------
  if (httpStatus >= 500) {
    throw err?.data || err;
  }

  // fallback
  throw err;
}

/* ----------------------------------------------------
   MAIN API WRAPPER
---------------------------------------------------- */
export default function ClientApi(url, payload, httpMethod, accessToken) {
  const Baseurl = `https://stfqc.integrumapps.com/security.api${url}`;

  const token = sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    token: accessToken || token || "",
  };

  switch (httpMethod) {
    case "GET":
      return axios.get(Baseurl, { headers }).then(checkStatus).catch(checkStatus);

    case "POST":
      return axios.post(Baseurl, payload, { headers }).then(checkStatus).catch(checkStatus);

    case "PUT":
      return axios.put(Baseurl, payload, { headers }).then(checkStatus).catch(checkStatus);

    case "DELETE":
      return axios.delete(Baseurl, { headers }).then(checkStatus).catch(checkStatus);

    default:
      console.error("Invalid HTTP Method", httpMethod);
      return null;
  }
}
