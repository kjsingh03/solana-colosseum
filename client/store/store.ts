// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import mainReducer from '@/store/slices';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        main: mainReducer,
        user:userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
