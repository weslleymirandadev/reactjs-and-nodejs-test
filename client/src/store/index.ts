import { configureStore } from '@reduxjs/toolkit';
import etherTooltipReducer from './etherTooltipSlice';

export const store = configureStore({
  reducer: {
    etherTooltip: etherTooltipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 