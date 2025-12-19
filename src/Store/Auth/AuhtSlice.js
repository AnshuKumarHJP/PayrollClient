import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";

const initialState = {
  Auth: { data: [], isLoading: false, error: null, Success: null },
};

export const FormBuilder_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH_REQUEST:
      return {
        ...state,
        Auth: { ...state.Auth, isLoading: true, error: null, Success: null },
      };

    case GET_AUTH_SUCCESS:
      return {
        ...state,
        Auth: {
          ...state.Auth,
          isLoading: false,
          data: action.payload,
          error: null,
          Success: true,
        },
      };

    case GET_AUTH_FAILURE:
      return {
        ...state,
        Auth: {
          ...state.Auth,
          isLoading: false,
          error: action.payload,
          Success: false,
        },
      };

    default:
      return state;
  }
};
