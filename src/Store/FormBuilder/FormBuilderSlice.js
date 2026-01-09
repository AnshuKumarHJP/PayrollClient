/* =====================================================
   OPTIMIZED REDUCER
   ✔ Only GET_ALL updates data
   ✔ GET_BY_ID / UPSERT / DELETE do NOT touch list
   ✔ Prevents unnecessary re-renders
   ✔ Keeps your existing ActionTypes
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
  DELETE_FORMBUILDER_FAILURE,
  UPSERT__FORMBUILDER_FAILURE,
  GET_FORMBUILDER_BY_ID_FAILURE,
  GET_FORMBUILDER_FAILURE,
  DELETE_FORMBUILDER_SUCCESS,
  UPSERT__FORMBUILDER_SUCCESS,
  GET_FORMBUILDER_BY_ID_SUCCESS,
  GET_FORMBUILDER_SUCCESS,
  DELETE_FORMBUILDER_REQUEST,
  UPSERT__FORMBUILDER_REQUEST,
  GET_FORMBUILDER_BY_ID_REQUEST,
  GET_FORMBUILDER_REQUEST
} from "./ActionType";

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
  FieldValidationRule: { data: [], isLoading: false, error: null, Success: null },
  FormBuilder: { data: [], isLoading: false, error: null, Success: null },
};

/* =====================================================
   REDUCER
===================================================== */
export const FormBuilder_Reducer = (state = initialState, action) => {
  switch (action.type) {

    /* ================= LOADING ================= */
    case GET_ALL_FIELDVALIDATIONRULES_REQUEST:
    case GET_FIELDVALIDATIONRULE_REQUEST:
    case UPSERT_FIELDVALIDATIONRULE_REQUEST:
    case DELETE_FIELDVALIDATIONRULE_REQUEST:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: true,
          error: null,
          Success: null
        }
      };

    case GET_FORMBUILDER_REQUEST:
    case GET_FORMBUILDER_BY_ID_REQUEST:
    case UPSERT__FORMBUILDER_REQUEST:
    case DELETE_FORMBUILDER_REQUEST:
      return {
        ...state,
        FormBuilder: {
          ...state.FormBuilder,
          isLoading: true,
          error: null,
          Success: null,
        },
      };

    /* ================= SUCCESS ================= */

    // ✅ ONLY PLACE WHERE DATA IS SET
    case GET_ALL_FIELDVALIDATIONRULES_SUCCESS:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          data: Array.isArray(action.payload)
            ? action.payload
            : [],
          Success: true
        }
      };

    // ❌ DO NOT TOUCH DATA
    case GET_FIELDVALIDATIONRULE_SUCCESS:
    case UPSERT_FIELDVALIDATIONRULE_SUCCESS:
    case DELETE_FIELDVALIDATIONRULE_SUCCESS:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          Success: true
        }
      };

    case GET_FORMBUILDER_SUCCESS:
      return {
        ...state,
        FormBuilder: {
          ...state.FormBuilder,
          isLoading: false,
          data: action.payload,
        },
      };

    case GET_FORMBUILDER_BY_ID_SUCCESS:
      return {
        ...state,
        FormBuilder: {
          ...state.FormBuilder,
          isLoading: false,
          data: action.payload,
          Success: true,
        },
      };

    case UPSERT__FORMBUILDER_SUCCESS:
    case DELETE_FORMBUILDER_SUCCESS:
      return {
        ...state,
        FormBuilder: {
          ...state.FormBuilder,
          isLoading: false,
          Success: true,
        },
      };


    /* ================= FAILURE ================= */
    case GET_ALL_FIELDVALIDATIONRULES_FAILURE:
    case GET_FIELDVALIDATIONRULE_FAILURE:
    case UPSERT_FIELDVALIDATIONRULE_FAILURE:
    case DELETE_FIELDVALIDATIONRULE_FAILURE:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          error: action.payload,
          Success: false
        }
      };

    case GET_FORMBUILDER_FAILURE:
    case GET_FORMBUILDER_BY_ID_FAILURE:
    case UPSERT__FORMBUILDER_FAILURE:
    case DELETE_FORMBUILDER_FAILURE:
      return {
        ...state,
        FormBuilder: {
          ...state.FormBuilder,
          isLoading: false,
          error: action.payload,
          Success: false,
        },
      };


    /* ================= CLEAR ================= */
    case CLEAR_SUCCESS:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          Success: null
        }
      };

    case CLEAR_ERROR:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          error: null
        }
      };

    default:
      return state;
  }
};
