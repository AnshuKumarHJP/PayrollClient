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

/* ===============================================================
// FieldValidationRule Actions - Added for FieldValidationRule API integration
// These actions handle CRUD operations for FieldValidationRule entities
================================================================ */

/* ===============================================================
// GET ALL FieldValidationRules
================================================================ */
export const GetAllFieldValidationRules = () => async (dispatch) => {
  dispatch({ type: GET_ALL_FIELDVALIDATIONRULES_REQUEST });

  try {
    const res = await ClientAPI("/api/FieldValidationRule/GetAllFieldValidationRules", null, "GET", null, 'normal');
    dispatch({ type: GET_ALL_FIELDVALIDATIONRULES_SUCCESS, payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: GET_ALL_FIELDVALIDATIONRULES_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch field validation rules",
    });
    throw error;
  }
};

/* ===============================================================
// GET FieldValidationRule By ID
================================================================ */
export const GetFieldValidationRuleById = (id) => async (dispatch) => {
  dispatch({ type: GET_FIELDVALIDATIONRULE_REQUEST });

  try {
    const res = await ClientAPI(`/api/FieldValidationRule/GetFieldValidationRuleById?Id=${id}`, null, "GET", null, 'normal');
    console.log(res.data);

    dispatch({ type: GET_FIELDVALIDATIONRULE_SUCCESS, payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: GET_FIELDVALIDATIONRULE_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch field validation rule",
    });
    throw error;
  }
};

/* ===============================================================
// UPSERT FieldValidationRule
================================================================ */
export const UpsertFieldValidationRule = (payload) => async (dispatch) => {
  try {
    const res = await ClientAPI("/api/FieldValidationRule/UpsertFieldValidationRule", payload, "PUT", null, "normal");
    const decryptedResult = CryptoService.decrypt(res?.data);

    if (!decryptedResult?.Status) {
      const msg = decryptedResult?.Message || "Failed to save field validation rule";

      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });

      throw new Error(msg);
    }
    toast({
      title: "Success",
      description: decryptedResult?.Message || "Saved successfully",
    });

    // ✅ return decrypted payload to caller
    return decryptedResult;

  } catch (error) {
    const msg =
      error?.response?.data?.Message ||
      error?.message ||
      "Failed to save field validation rule";

    toast({
      title: "Error",
      description: msg,
      variant: "destructive",
    });

    throw error;
  }
};

/* ===============================================================
// DELETE FieldValidationRule By ID
================================================================ */
export const DeleteFieldValidationRuleById = (id) => async (dispatch) => {
  dispatch({ type: DELETE_FIELDVALIDATIONRULE_REQUEST });

  try {
    const res = await ClientAPI("/api/FieldValidationRule/DeleteFieldValidationRuleById", { Id: id }, "PUT", null, 'normal');

    dispatch({ type: DELETE_FIELDVALIDATIONRULE_SUCCESS, payload: res.data });

    toast({ title: "Success", description: "Field validation rule deleted." });
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete field validation rule";

    dispatch({ type: DELETE_FIELDVALIDATIONRULE_FAILURE, payload: msg });

    toast({ title: "Error", description: msg, variant: "destructive" });
  }
};

/* ===============================================================
// CLEAR SUCCESS
================================================================ */
export const clearSuccess = () => ({ type: CLEAR_SUCCESS });

/* ===============================================================
// CLEAR ERROR
================================================================ */
export const clearError = () => ({ type: CLEAR_ERROR });
