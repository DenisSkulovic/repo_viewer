import { configureStore } from "@reduxjs/toolkit";
import githubReducer from "./githubSlice";
import contributorsReducer from "./contributorsSlice";

export const store = configureStore({
    reducer: {
        github: githubReducer,
        contributors: contributorsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
