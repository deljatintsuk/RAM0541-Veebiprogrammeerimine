import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import messageReducer from './slices/messageSlice';
import editionReducer from './slices/editionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    editions: editionReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;