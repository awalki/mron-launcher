import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import launcherReducer from "./launcher/launcherSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    launcher: launcherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
