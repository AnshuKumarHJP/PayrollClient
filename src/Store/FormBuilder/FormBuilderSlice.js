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

const initialState = {
  FieldValidationRule: { data: null, isLoading: false, error: null, Success: null },
};

export const FormBuilder_Reducer = (state = initialState, action) => {
  switch (action.type) {
    /* FIELDVALIDATIONRULE LOADING STATES */
    case GET_FIELDVALIDATIONRULE_REQUEST:
    case UPSERT_FIELDVALIDATIONRULE_REQUEST:
    case DELETE_FIELDVALIDATIONRULE_REQUEST:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: true,
          error: null,
          Success: null,
        },
      };

    /* FIELDVALIDATIONRULE SUCCESS STATES */
    case GET_ALL_FIELDVALIDATIONRULES_SUCCESS:
    case GET_FIELDVALIDATIONRULE_SUCCESS:
    case UPSERT_FIELDVALIDATIONRULE_SUCCESS:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          data: action.payload,
          Success: true,
        },
      };

    case DELETE_FIELDVALIDATIONRULE_SUCCESS:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          Success: true,
        },
      };

    /* FIELDVALIDATIONRULE ERROR STATES */
    case GET_FIELDVALIDATIONRULE_FAILURE:
    case UPSERT_FIELDVALIDATIONRULE_FAILURE:
    case DELETE_FIELDVALIDATIONRULE_FAILURE:
      return {
        ...state,
        FieldValidationRule: {
          ...state.FieldValidationRule,
          isLoading: false,
          error: action.payload,
          Success: false,
        },
      };

    /* CLEAR FLAGS */
    case CLEAR_SUCCESS:
      return {
        ...state,
        FieldValidationRule: { ...state.FieldValidationRule, Success: null },
      };

    case CLEAR_ERROR:
      return {
        ...state,
        FieldValidationRule: { ...state.FieldValidationRule, error: null },
      };

    default:
      return state;
  }
};
