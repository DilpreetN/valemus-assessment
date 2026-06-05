import { configureStore } from "@reduxjs/toolkit";
import projectSliceReducer from "./projectSlice";
import investmentSliceReducer from "./investmentSlice.ts";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    projects: projectSliceReducer,
    investments: investmentSliceReducer
  },
  devTools: true, // Should be based on env (okay for assessment)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
