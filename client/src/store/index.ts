import { configureStore } from '@reduxjs/toolkit';
import etherTooltipReducer from './etherTooltipSlice';
import walletReducer from './walletSlice';

export const store = configureStore({
  reducer: {
    etherTooltip: etherTooltipReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 