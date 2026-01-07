/* =====================================================
   OPTIMIZED ACTIONS
   ✔ Only GET_ALL sets data
   ✔ GET_BY_ID / UPSERT / DELETE do NOT affect list
   ✔ Same ActionTypes (no breaking change)
   ✔ Cleaner flow & predictable UI
===================================================== */

import {
  GET_ALL_FIELDVALIDATIONRULES_REQUEST,
  GET_ALL_FIELDVALIDATIONRULES_SUCCESS,
  GET_ALL_FIELDVALIDATIONRULES_FAILURE,

  GET_FIELDVALIDATIONRULE_REQUEST,
  GET_FIELDVALIDATIONRULE_SUCCESS,
  GET_FIELDVALIDATIONRULE_FAILURE,

  UPSERT_FIELDVALIDATIONRULE_REQUEST,
  UPSERT_FIELDVALIDATIONRULE_SUCCESS,
  UPSERT_FIELDVALIDATIONRULE_FAILURE,

  DELETE_FIELDVALIDATIONRULE_REQUEST,
  DELETE_FIELDVALIDATIONRULE_SUCCESS,
  DELETE_FIELDVALIDATIONRULE_FAILURE,

  CLEAR_SUCCESS,
  CLEAR_ERROR
} from "./ActionType";

import ClientAPI from "../../services/ClientApi";
import { toast } from "../../Lib/use-toast";
import CryptoService from "../../Security/useCrypto";

/* =====================================================
   GET ALL – ONLY PLACE WHERE LIST DATA IS SET
===================================================== */
export const GetAllFieldValidationRules = () => async (dispatch) => {
  dispatch({ type: GET_ALL_FIELDVALIDATIONRULES_REQUEST });

  try {
    const res = await ClientAPI(
      "/api/FieldValidationRule/GetAllFieldValidationRules",
      null,
      "GET",
      null,
      "normal"
    );

    const decrypted = CryptoService.decrypt(res?.data);

    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch field validation rules"
      );
    }

    const parsedResult =
      typeof decrypted.Result === "string"
        ? JSON.parse(decrypted.Result)
        : decrypted.Result ?? [];

    dispatch({
      type: GET_ALL_FIELDVALIDATIONRULES_SUCCESS,
      payload: parsedResult
    });

    return parsedResult;
  } catch (error) {
    dispatch({
      type: GET_ALL_FIELDVALIDATIONRULES_FAILURE,
      payload: error.message || "Failed to fetch field validation rules"
    });
    throw error;
  }
};

/* =====================================================
   GET BY ID – DOES NOT TOUCH LIST
===================================================== */
export const GetFieldValidationRuleById = (id) => async (dispatch) => {
  dispatch({ type: GET_FIELDVALIDATIONRULE_REQUEST });

  try {
    const decryptedId = CryptoService.decrypt(id);

    const res = await ClientAPI(
      `/api/FieldValidationRule/GetFieldValidationRuleById?Id=${decryptedId}`,
      null,
      "GET",
      null,
      "normal"
    );

    dispatch({
      type: GET_FIELDVALIDATIONRULE_SUCCESS,
      payload: res.data
    });

    return res.data;
  } catch (error) {
    dispatch({
      type: GET_FIELDVALIDATIONRULE_FAILURE,
      payload:
        error?.response?.data?.message ||
        "Failed to fetch field validation rule"
    });
    throw error;
  }
};

/* =====================================================
   UPSERT – DOES NOT TOUCH LIST
===================================================== */
export const UpsertFieldValidationRule = (payload) => async (dispatch) => {
  dispatch({ type: UPSERT_FIELDVALIDATIONRULE_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(payload);

    const res = await ClientAPI(
      "/api/FieldValidationRule/UpsertFieldValidationRule",
      encryptedPayload,
      "PUT",
      null,
      "normal"
    );

    const decrypted = CryptoService.decrypt(res?.data);

    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to save field validation rule"
      );
    }

    dispatch({ type: UPSERT_FIELDVALIDATIONRULE_SUCCESS });

    toast({
      title: "Success",
      description: decrypted?.Message || "Saved successfully"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: UPSERT_FIELDVALIDATIONRULE_FAILURE,
      payload: error.message || "Failed to save field validation rule"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });

    throw error;
  }
};

/* =====================================================
   DELETE – DOES NOT TOUCH LIST
===================================================== */
export const DeleteFieldValidationRuleById = (id) => async (dispatch) => {
  dispatch({ type: DELETE_FIELDVALIDATIONRULE_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);

    const res = await ClientAPI(
      "/api/FieldValidationRule/DeleteFieldValidationRuleById",
      encryptedPayload,
      "PUT",
      null,
      "normal"
    );

    const decrypted = CryptoService.decrypt(res?.data);

    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete field validation rule"
      );
    }

    dispatch({ type: DELETE_FIELDVALIDATIONRULE_SUCCESS });

    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: DELETE_FIELDVALIDATIONRULE_FAILURE,
      payload: error.message || "Failed to delete field validation rule"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });

    throw error;
  }
};

/* =====================================================
   CLEAR FLAGS
===================================================== */
export const clearSuccess = () => ({ type: CLEAR_SUCCESS });
export const clearError = () => ({ type: CLEAR_ERROR });
