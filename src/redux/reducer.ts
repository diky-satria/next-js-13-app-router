import { combineReducers } from "redux";
import counter from "./counter/reducer";
import navbarMobile from "./navbarMobile/reducer";

const reducer: any = combineReducers({
  counter: counter,
  navbarMobile: navbarMobile,
});

export default reducer;
