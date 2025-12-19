import aesUtils from "../../services/aesUtils";
import ClientApi from "../../services/ClientApi";
import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";

const getAuthRequest = () => ({ type: GET_AUTH_REQUEST });
const getAuthSuccess = (data) => ({ type: GET_AUTH_SUCCESS, payload: data });
const getAuthFailure = (error) => ({ type: GET_AUTH_FAILURE, payload: error });

export const AuthenticateUser = () => async (dispatch) => {
  dispatch(getAuthRequest());

  // ✅ Renamed (NO MORE payload conflict)
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
    UserName: "15172",
    Password: "test",
    Location: {
      Id: 0,
      Latitude: 0,
      Longitude: 0,
      Radius: 0,
      RadiusDistanceIn: 0,
      Address: ""
    },
    IMEI: "",
    Network: {
      Id: 0,
      CompanyId: 0,
      ClientId: 0,
      IPAddresses: "",
      RouterPublicIPs: "",
      RouterPrivateIPs: "",
      Comments: ""
    },
    Browser: { Id: 0, Name: "", Version: "" },
    Device: { Id: 0, Type: 0, BrandName: "", Model: "", OSName: "", OSVersion: "" },
    AuthType: 0,
    ClientCode: ""
  };

  try {
    const res = await ClientApi(
      "/api/Security/AuthenticateUser",
      apiPayload,  // ✅ Correct variable
      "POST",
      ""
    );

    const encryptedResult = res?.data?.Result;

    // FULL decrypt
    const decrypted = aesUtils.decryptAES(encryptedResult);

    console.log("FINAL DECRYPTED =", decrypted);
    console.log("MfiLog =", decrypted.MfiLog);   // decrypted
    console.log("GfiLog =", decrypted.GfiLog);   // decrypted
    console.log("Token =", decrypted.Token);     // decrypted

    dispatch(getAuthSuccess({ apiRaw: res.data, decrypted }));


  } catch (error) {
    console.error("❌ AUTH FAILED", error);
    dispatch(getAuthFailure(error?.response?.data || "Login failed"));
  }
};
