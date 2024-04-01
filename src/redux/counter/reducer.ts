import { ADD_VALUE, LESS_VALUE } from "./action";

const authInitialState = {
  value: 0,
};

const initialState = {
  ...authInitialState,
  action: "",
};

const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_VALUE:
      return {
        ...state,
        action: action.type,
        value: state.value + 1,
      };
    case LESS_VALUE:
      return {
        ...state,
        action: action.type,
        value: state.value - 1,
      };
    default:
      return state;
  }
};

export default counterReducer;
