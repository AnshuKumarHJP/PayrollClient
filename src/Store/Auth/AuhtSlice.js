import {
  GET_AUTH_REQUEST,
  GET_AUTH_SUCCESS,
  GET_AUTH_FAILURE
} from "./ActionType";

const initialState = {
  LogResponce: { data: [], isLoading: false, error: null, Success: null },
};

export const Auth_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH_REQUEST:
      return {
        ...state,
        LogResponce: { ...state.LogResponce, isLoading: true, error: null, Success: null },
      };

    case GET_AUTH_SUCCESS:
      return {
        ...state,
        LogResponce: {
          ...state.LogResponce,
          isLoading: false,
          data: action.payload,
          error: null,
          Success: true,
        },
      };

    case GET_AUTH_FAILURE:
      return {
        ...state,
        LogResponce: {
          ...state.LogResponce,
          isLoading: false,
          error: action.payload,
          Success: false,
        },
      };
    case "RESET_AUTH":
        return initialState;
    default:
      return state;
  }
};
