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
export async function checkStatus(response) {
  // SUCCESS (2xx)
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const err = response?.response || response;

  // UNAUTHORIZED (401)
  if (err.status === 401) {
    await handleUnauthorized();
    return err;
  }

  // CLIENT ERRORS (400–499)
  if (err.status >= 400 && err.status < 500) {
    return err;
  }

  // SERVER ERRORS (500–599)
  if (err.status >= 500 && err.status < 600) {
    return err;
  }

  return err;
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
