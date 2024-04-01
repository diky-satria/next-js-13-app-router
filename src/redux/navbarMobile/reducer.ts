import {
  DRAWER_OPEN,
  DRAWER_CLOSE,
  ACCORDION_ACTIVE,
  MENU_ACTIVE,
} from "./action";

const authInitialState = {
  isOpen: true,
  isOpenAccordion: [],
  isActiveMenu: [],
};

const initialState = {
  ...authInitialState,
  action: "",
};

const authReducerError = (state = initialState, action: any) => {
  switch (action.type) {
    case DRAWER_OPEN:
      return {
        ...state,
        action: action.type,
        isOpen: true,
      };
    case DRAWER_CLOSE:
      return {
        ...state,
        action: action.type,
        isOpen: false,
      };
    case ACCORDION_ACTIVE:
      return {
        ...state,
        action: action.type,
        isOpenAccordion: action.payload,
      };
    case MENU_ACTIVE:
      return {
        ...state,
        action: action.type,
        isActiveMenu: action.payload,
      };
    default:
      return state;
  }
};

export default authReducerError;
