import commonSlice from "./slices/slice";
import { combineReducers } from "@reduxjs/toolkit";
const rootReducer = combineReducers({
  common: commonSlice,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
export default rootReducer;
