import { decryptResponseByAES } from "../../Security/aesUtils";
import ClientApi from "../../services/ClientApi";
import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";
import { toast } from "../../Library/use-toast";
import { setSelectedRole, setNodeSession } from "./AuthSlice";
import { setIsLoading } from "../Slices/GlobalSlice";
import { moveToFirstAsync } from "../../services/HealperFunction";
import { NodeApi } from "../../services/NodeClientApi";


// ─────────────────────────────────────────────────────────────────────────────
// Action Creators
// ─────────────────────────────────────────────────────────────────────────────
const getAuthRequest = () => ({ type: GET_AUTH_REQUEST });
const getAuthSuccess = (data) => ({ type: GET_AUTH_SUCCESS, payload: data });
const getAuthFailure = (error) => ({ type: GET_AUTH_FAILURE, payload: error });

// ─────────────────────────────────────────────────────────────────────────────
// ROLE SWITCH
// ─────────────────────────────────────────────────────────────────────────────
export const handleRoleSwitch = (role, navigate) => async (dispatch, getState) => {
  const controller = new AbortController();

  try {
    dispatch(setIsLoading(true));

    const state = getState();
    const AUTH_DATA = state.Auth.LogResponce.data;
    const rolesRaw = AUTH_DATA?.UIRoles || [];

    const payload = {
      IsCompanyHierarchy: false,
      RoleCode: role.Code,
      RoleId: role.Id,
    };

    const token = AUTH_DATA?.Token;

    const res = await ClientApi(
      "/api/Security/UpdateRoleInSession",
      payload,
      "PUT",
      token,
      "security",
      controller.signal
    );

    if (!res?.data?.Status) {
      dispatch(setIsLoading(false));
      toast({
        title: "Access denied",
        description: res?.data?.Message || "Unauthorized",
        variant: "danger",
      });
      return false;
    }

    const reorderedRoles = await moveToFirstAsync(
      rolesRaw,
      (x) => x.Role?.Code === role.Code
    );

    const updatedSession = {
      ...AUTH_DATA,
      UIRoles: reorderedRoles,
    };

    dispatch(getAuthSuccess(updatedSession));
    dispatch(setSelectedRole(role.Code));

    toast({
      title: "Role switched",
      description: `Active role: ${role.Code}`,
      variant: "success",
    });

    dispatch(setIsLoading(false));
    navigate("/");
    return true;

  } catch (err) {
    console.error(err);
    dispatch(setIsLoading(false));
    toast({
      title: "Role switch failed",
      description: "Server or network error",
      variant: "danger",
    });
    return false;
  } finally {
    controller.abort();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE SESSION IN NODE API
// Called internally after successful C# login.
// Sends the full C# auth response  → gets back a sessionToken UUID.
// ─────────────────────────────────────────────────────────────────────────────
export const storeNodeSession = (authData) => async (dispatch) => {
  try {
    if (!authData) {
      toast({
        title: "Error",
        description: "No auth data found",
        variant: "danger",
      });
      return null;
    }

    // NodeClientApi handles encryption automatically (useStatic=true for /session/store)
    // Send the raw authData object — do NOT pre-encrypt it here
    const result = await NodeApi.post(
      "/api/v1/session/store",
      {
        authData,          // plain object → NodeClientApi encrypts the whole body
        ttlMinutes: 480,
      }
    );

    // NodeClientApi already decrypts the response — result is the plain decrypted object
    console.log("[NodeSession] store response:", result);

    if (result?.sessionToken) {
      dispatch(setNodeSession({ sessionToken: result.sessionToken, expiresAt: result.expiresAt }));

      console.info("[NodeSession] ✅ Session stored in Node API", {
        sessionToken: result.sessionToken,
        expiresAt: result.expiresAt,
      });

      return result;
    }

    console.warn("[NodeSession] Node API storage succeeded but returned no sessionToken", result);
    return null;

  } catch (err) {
    // Non-fatal — C# login was successful. Log & continue.
    console.error("[NodeSession] ❌ Failed to store session in Node API:", err?.message || err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATE USER (C# Login → Redux → Node session store)
// ─────────────────────────────────────────────────────────────────────────────
export const AuthenticateUser = (formData, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch(getAuthRequest());

  const apiPayload = {
    AuthConfiguration: {
      Id: 2,
      KeyName: "",
      Description: "for deputees/Empoyees",
      CompanyId: 5,
      ClientId: 0,
      AuthType: 0,
      UserType: 1,
      PermissibleDeviceType: 0,
      TwoWayAuthType: 0,
      SSOProviderId: 0,
      PermissibleNetworkId: 0,
      PermissibleGeoLocationId: 0,
      MaxWrongAttempts: 5,
      AutoUnlockInMinutes: 4,
      AllowMultiBrowserLogin: true,
      AllowMultiDeviceLogin: true,
      Status: 1,
      IsCaptchaRequired: false
    },
    CompanyId: 5,
    SSOEmailId: "",
    UserType: 1,
    ClientId: 0,
    UserName: formData?.UserName,
    Password: formData?.password,
    Location: {
      Id: 0, Latitude: 0, Longitude: 0,
      Radius: 0, RadiusDistanceIn: 0, Address: ""
    },
    IMEI: "",
    Network: {
      Id: 0, CompanyId: 0, ClientId: 0,
      IPAddresses: "", RouterPublicIPs: "",
      RouterPrivateIPs: "", Comments: ""
    },
    Browser: { Id: 0, Name: "", Version: "" },
    Device: { Id: 0, Type: 0, BrandName: "", Model: "", OSName: "", OSVersion: "" },
    AuthType: 0,
    ClientCode: ""
  };

  try {
    // ── Step 1: Call C# Security API ────────────────────────────────────────
    const res = await ClientApi(
      "/api/Security/AuthenticateUser",
      apiPayload,
      "POST",
      "",
      "security",
      signal || controller.signal
    );

    if (!res?.data?.Status) {
      toast({
        title: "Login Failed",
        description: res?.data?.Message || "Invalid credentials",
        variant: "danger",
      });
      dispatch(getAuthFailure(res?.data?.Message));
      return;
    }

    // ── Step 2: Decrypt C# response (one-time decryption using VITE_HFK/VITE_HFV) ──
    const encryptedResult = res?.data?.Result;
    const decrypted = decryptResponseByAES(encryptedResult);

    // Store C# token in sessionStorage (used by ClientApi for subsequent C# calls)
    if (decrypted?.Token) {
      sessionStorage.setItem("__tn__", decrypted.Token);
    }

    // ── Step 3: Build full data object (everything from C# API) ─────────────
    //    • This mirrors the exact StoreData you already store in Redux.
    //    • ALL fields are stored — Token, Key, Vector, UserDetails, UIRoles,
    //      ClientList, ClientContractList, Company, UserSession.
    const StoreData = {
      Token: decrypted?.Token || null,
      Key: decrypted?.Key || null,
      Vector: decrypted?.Vector || null,
      UserDetails: decrypted?.UserDetails || null,
      UIRoles: decrypted?.UIRoles || [],
      ClientList: decrypted?.ClientList || [],
      ClientContractList: decrypted?.ClientContractList || [],
      Company: decrypted?.Company || null,
      UserSession: decrypted?.UserSession || null,
    };

    // ── Step 4: Dispatch to Redux (existing flow — unchanged) ───────────────
    dispatch(getAuthSuccess(StoreData));

    // Set default active role from first UIRole
    if (StoreData.UIRoles?.length > 0) {
      const firstRoleCode = StoreData.UIRoles[0].Role.Code;
      dispatch(setSelectedRole(firstRoleCode));
    }

    // ── Step 5: Store session in Node API (non-blocking) ────────────────────
    // Fire-and-forget — Node session failure doesn't block UI login
    // dispatch(storeNodeSession(StoreData)).then((nodeSession) => {
    //   if (nodeSession?.user) {
    //     console.info("[Auth] Node session ready →", nodeSession.user);
    //   }
    // });

  } catch (error) {
    console.error("AUTH FAILED", error);
    let errorMessage = "Login failed";

    if (error.code === "ERR_NETWORK") {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection or try again later.",
        variant: "danger",
      });
      errorMessage = "Unable to connect to the server.";
    } else if (error.response?.data) {
      errorMessage = error.response.data;
    }

    dispatch(getAuthFailure(errorMessage));
  } finally {
    controller.abort();
  }
};
