import axios from "axios";
import { persistor, store } from "../Store/Store";
import { resetGlobalStore } from "../Store/Slices/GlobalSlice";
import { navigateTo } from "./navigationService";

/* ----------------------------------------------------
   HANDLE 401 SESSION EXPIRED
---------------------------------------------------- */
async function handleUnauthorized() {
  try {
    const dispatch = store.dispatch;

    dispatch({ type: "RESET_AUTH" });
    dispatch(resetGlobalStore());

    sessionStorage.clear();
    localStorage.clear();

    if (persistor) {
      await persistor.flush();
      await persistor.purge();
    }

    navigateTo("/session-expired");
  } catch (e) {
    console.error("Error handling unauthorized:", e);
  }
}

/* ----------------------------------------------------
   RESPONSE CHECKER
---------------------------------------------------- */
export async function checkStatus(res) {
  // ✅ ignore aborted requests
  if (res?.name === "CanceledError") {
    return Promise.reject(res);
  }

  // ---------- SUCCESS ----------
  if (res?.status >= 200 && res?.status < 300) {
    const data = res?.data;

    const backendUnauthorized =
      data?.Message === "Unauthorized action" ||
      data?.Message === "Token expired" ||
      data?.Message === "Session expired" ||
      (data?.Status === false && typeof data?.Result === "undefined");

    if (backendUnauthorized) {
      await handleUnauthorized();
    }

    return res;
  }

  // ---------- ERROR ----------
  const err = res?.response || res;
  const httpStatus = err?.status;

  if (httpStatus === 401) {
    await handleUnauthorized();
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    throw err?.data || err;
  }

  if (httpStatus >= 500) {
    throw err?.data || err;
  }

  throw err;
}

/* ----------------------------------------------------
   MAIN API WRAPPER (WITH ABORT SUPPORT)
---------------------------------------------------- */
export default function ClientApi(
  url,
  payload,
  httpMethod,
  accessToken,
  apiType,
  signal // 👈 ADD THIS
) {
  // ---------- BASE URL RESOLUTION ----------
  let finalBaseUrl = "";
  let NORMAL_API_URL = import.meta.env.VITE_PAYROLL_API_BASE_URL;
  let SECURITY_API_URL = import.meta.env.VITE_SECURITY_API_BASE_URL;

  if (!NORMAL_API_URL || !SECURITY_API_URL) {
    console.error("API base URLs are not defined");
    return null;
  }

  if (apiType === "security") {
    finalBaseUrl = SECURITY_API_URL;
  } else if (apiType === "normal") {
    finalBaseUrl = NORMAL_API_URL;
  } else {
    finalBaseUrl = url.includes("/api/Security/")
      ? SECURITY_API_URL
      : NORMAL_API_URL;
  }

  const Baseurl = `${finalBaseUrl}${url}`;
  const token = sessionStorage.getItem("token");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json;charset=UTF-8",
    token: accessToken || token || "",
  };

  const config = {
    headers,
    signal, // 🔥 KEY LINE
  };

  switch (httpMethod) {
    case "GET":
      return axios.get(Baseurl, config).then(checkStatus).catch(checkStatus);

    case "POST":
      return axios
        .post(Baseurl, payload?.data ?? payload, config)
        .then(checkStatus)
        .catch(checkStatus);

    case "PUT":
      return axios({
        method: "PUT",
        url: Baseurl,
        data: payload?.data ?? payload,
        headers,
        signal, // 🔥 KEY LINE
        transformRequest: [
          (data) => (typeof data === "string" ? data : JSON.stringify(data)),
        ],
      })
        .then(checkStatus)
        .catch(checkStatus);

    case "DELETE":
      return axios
        .delete(Baseurl, config)
        .then(checkStatus)
        .catch(checkStatus);

    default:
      console.error("Invalid HTTP Method", httpMethod);
      return null;
  }
}
