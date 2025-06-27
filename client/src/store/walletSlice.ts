import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  walletType: string | null;
  isConnected: boolean;
  error: string | null;
}

// Carregar estado inicial do localStorage
const loadWalletState = (): WalletState => {
  try {
    const savedState = localStorage.getItem('walletState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        address: parsed.address,
        walletType: parsed.walletType,
        isConnected: parsed.isConnected,
        error: null,
      };
    }
  } catch (error) {
    console.error('Error loading wallet state from localStorage:', error);
  }
  
  return {
    address: null,
    walletType: null,
    isConnected: false,
    error: null,
  };
};

const initialState: WalletState = loadWalletState();

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string; walletType: string }>) => {
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.isConnected = true;
      state.error = null;
      
      // Salvar no localStorage
      localStorage.setItem('walletState', JSON.stringify({
        address: state.address,
        walletType: state.walletType,
        isConnected: state.isConnected,
      }));
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.walletType = null;
      state.isConnected = false;
      state.error = null;
      
      // Remover do localStorage
      localStorage.removeItem('walletState');
    },
    setWalletError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
    // Action para restaurar estado da carteira
    restoreWalletState: (state, action: PayloadAction<{ address: string; walletType: string }>) => {
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.isConnected = true;
      state.error = null;
    },
  },
});

export const { connectWallet, disconnectWallet, setWalletError, clearWalletError, restoreWalletState } = walletSlice.actions;
export default walletSlice.reducer; 