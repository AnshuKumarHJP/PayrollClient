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
  CLEAR_ERROR,

  DELETE_FORMBUILDER_REQUEST,
  DELETE_FORMBUILDER_SUCCESS,
  DELETE_FORMBUILDER_FAILURE,

  UPSERT__FORMBUILDER_REQUEST,
  UPSERT__FORMBUILDER_SUCCESS,
  UPSERT__FORMBUILDER_FAILURE,

  GET_FORMBUILDER_REQUEST,
  GET_FORMBUILDER_SUCCESS,
  GET_FORMBUILDER_FAILURE,

  GET_FORMBUILDER_BY_ID_REQUEST,
  GET_FORMBUILDER_BY_ID_SUCCESS,
  GET_FORMBUILDER_BY_ID_FAILURE,

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
    const encryptedPayload = await CryptoService.encrypt({ FieldValidationRule: payload });

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








/* ===============================================================
// FormBuilder Actions
================================================================ */


/* ===============================================================
// GET ALL Forms
================================================================ */
export const GetFormBuilder = () => async (dispatch) => {
  dispatch({ type: GET_FORMBUILDER_REQUEST });

  try {
     const res = await ClientAPI(
      "/api/FormBuilder/GetAllFormBuilderHeader",
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
    let parsed = [];
    try {
      parsed = JSON.parse(decrypted.Result || "[]");
    } catch (e) {
      parsed = [];
    }
    dispatch({ type: GET_FORMBUILDER_SUCCESS, payload:parsed });
  } catch (error) {
    dispatch({
      type: GET_FORMBUILDER_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch forms",
    });
  }
};

/* ===============================================================
// GET Form By ID
================================================================ */
export const GetFormBuilderById = (id) => async (dispatch) => {
  dispatch({ type: GET_FORMBUILDER_BY_ID_REQUEST });

  try {
    const res = await ClientAPI.get(`/api/formbuilder/FormBuilderHeader/${id}`);

    // Backend returns: data1 = header JSON, data2 = details JSON
    const headerStr = res?.data?.data?.data1;
    const detailsStr = res?.data?.data?.data2;

    // SAFELY PARSE HEADER
    let header = {};
    try {
      header = headerStr && headerStr.trim() !== "" 
        ? JSON.parse(headerStr) 
        : {};
    } catch (e) {
      header = {};
    }

    // SAFELY PARSE DETAILS
    let details = [];
    try {
      details = detailsStr && detailsStr.trim() !== "" 
        ? JSON.parse(detailsStr) 
        : [];
    } catch (e) {
      details = [];
    }

    // MERGE AND RETURN
    return {
      ...header,
      Details: details,
    };
  } 
  catch (error) {
    dispatch({
      type: GET_FORMBUILDER_BY_ID_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch form",
    });
    throw error;
  }
};


/* =====================================================
   UPSERT FORM BUILDER – DOES NOT TOUCH LIST
===================================================== */
export const UpsertFormBuilder = (payload) => async (dispatch) => {
  dispatch({ type: UPSERT__FORMBUILDER_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(payload);

    const res = await ClientAPI(
      "/api/FormBuilder/UpsertFormBuilderHeader",
      encryptedPayload,
      "PUT",
      null,
      "normal"
    );
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to save form builder"
      );
    }
    dispatch({ type: UPSERT__FORMBUILDER_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Saved successfully"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: UPSERT__FORMBUILDER_FAILURE,
      payload: error.message || "Failed to save form builder"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });

    throw error;
  }
};


/* ===============================================================
// DELETE Form
================================================================ */
export const DeleteFormBuilder = (id) => async (dispatch) => {
  dispatch({ type: DELETE_FORMBUILDER_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);

    const res = await ClientAPI(
      "/api/FormBuilder/DeleteFormBuilderHeaderById",
      encryptedPayload,
      "PUT",
      null,
      "normal"
    );

   const decrypted = CryptoService.decrypt(res?.data);

    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete form builder"
      );
    }

    dispatch({ type: DELETE_FORMBUILDER_SUCCESS });

    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully"
    });

    return decrypted;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete form";

    dispatch({ type: DELETE_FORMBUILDER_FAILURE, payload: msg });

    toast({ title: "Error", description: msg, variant: "destructive" });
  }
};






/* =====================================================
   CLEAR FLAGS
===================================================== */
export const clearSuccess = () => ({ type: CLEAR_SUCCESS });
export const clearError = () => ({ type: CLEAR_ERROR });
