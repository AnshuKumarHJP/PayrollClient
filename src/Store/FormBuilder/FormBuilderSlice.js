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

  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_REQUEST,
  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_SUCCESS,
  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_FAILURE,

  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_REQUEST,
  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_SUCCESS,
  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_FAILURE,

  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_REQUEST,
  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_SUCCESS,
  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_FAILURE,

} from "./ActionType";

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  FieldValidationRule: { data: [], isLoading: false, error: null, Success: null },
  FormBuilder: { data: [], isLoading: false, error: null, Success: null },
  ClientFormBuilderHeaderMapping: { data: [], isLoading: false, error: null, Success: null },
};

/* =====================================================
   REDUCER
===================================================== */
export const FormBuilder_Reducer = (state = initialState, action) => {
  switch (action.type) {

    /* ================= LOADING ================= */

    // Validation Rules 
    case GET_ALL_FIELDVALIDATIONRULES_REQUEST:
    case GET_FIELDVALIDATIONRULE_REQUEST:
    case UPSERT_FIELDVALIDATIONRULE_REQUEST:
    case DELETE_FIELDVALIDATIONRULE_REQUEST:
      return { ...state, FieldValidationRule: { ...state.FieldValidationRule, isLoading: true, error: null, Success: null } };

    // Form Builder
    case GET_FORMBUILDER_REQUEST:
    case GET_FORMBUILDER_BY_ID_REQUEST:
    case UPSERT__FORMBUILDER_REQUEST:
    case DELETE_FORMBUILDER_REQUEST:
      return { ...state, FormBuilder: { ...state.FormBuilder, isLoading: true, error: null, Success: null, }, };

    // ClientFormBuilderHeaderMapping
    case INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_REQUEST:
    case DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_REQUEST:
    case GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_REQUEST:
      return { ...state, ClientFormBuilderHeaderMapping: { ...state.ClientFormBuilderHeaderMapping, isLoading: true, error: null, Success: null }, };

    /* ================= SUCCESS ================= */

    // Validation Rules
    case GET_ALL_FIELDVALIDATIONRULES_SUCCESS:
      return { ...state, FieldValidationRule: { ...state.FieldValidationRule, isLoading: false, data: action.payload, Success: true } };

    case GET_FIELDVALIDATIONRULE_SUCCESS:
    case UPSERT_FIELDVALIDATIONRULE_SUCCESS:
    case DELETE_FIELDVALIDATIONRULE_SUCCESS:
      return { ...state, FieldValidationRule: { ...state.FieldValidationRule, isLoading: false, Success: true } };

    // Form Builder
    case GET_FORMBUILDER_SUCCESS:
      return { ...state, FormBuilder: { ...state.FormBuilder, isLoading: false, data: action.payload, Success: true }, };

    case GET_FORMBUILDER_BY_ID_SUCCESS:
      return { ...state, FormBuilder: { ...state.FormBuilder, isLoading: false, data: action.payload, Success: true, }, };

    case UPSERT__FORMBUILDER_SUCCESS:
    case DELETE_FORMBUILDER_SUCCESS:
      return { ...state, FormBuilder: { ...state.FormBuilder, isLoading: false, Success: true, }, };


    /* ================= FAILURE ================= */

    // Validation Rules
    case GET_ALL_FIELDVALIDATIONRULES_FAILURE:
    case GET_FIELDVALIDATIONRULE_FAILURE:
    case UPSERT_FIELDVALIDATIONRULE_FAILURE:
    case DELETE_FIELDVALIDATIONRULE_FAILURE:
      return { ...state, FieldValidationRule: { ...state.FieldValidationRule, isLoading: false, error: action.payload, Success: false } };

    // Form Builder
    case GET_FORMBUILDER_FAILURE:
    case GET_FORMBUILDER_BY_ID_FAILURE:
    case UPSERT__FORMBUILDER_FAILURE:
    case DELETE_FORMBUILDER_FAILURE:
      return { ...state, FormBuilder: { ...state.FormBuilder, isLoading: false, error: action.payload, Success: false, }, };

    // ClientFormBuilderHeaderMapping
    case INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_SUCCESS:
      return { ...state, ClientFormBuilderHeaderMapping: { ...state.ClientFormBuilderHeaderMapping, isLoading: false, Success: true }, };

    case GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_SUCCESS:
      return { ...state, ClientFormBuilderHeaderMapping: { ...state.ClientFormBuilderHeaderMapping, isLoading: false, data: action.payload, Success: true }, };


    case DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_SUCCESS:
      return { ...state, ClientFormBuilderHeaderMapping: { ...state.ClientFormBuilderHeaderMapping, isLoading: false, Success: true }, };

    // ClientFormBuilderHeaderMapping - FAILURE
    case INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_FAILURE:
    case DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_FAILURE:
    case GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_FAILURE:
      return { ...state, ClientFormBuilderHeaderMapping: { ...state.ClientFormBuilderHeaderMapping, isLoading: false, error: action.payload, Success: false }, };



    default:
      return state;
  }
};
