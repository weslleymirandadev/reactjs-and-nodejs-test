import { connectWallet, disconnectWallet } from '../store/walletSlice';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import type { RootState, AppDispatch } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// Fix window.ethereum typing
declare global {
    interface Window {
        ethereum?: any;
        phantom?: any;
    }
}

const coinbaseWallet = createCoinbaseWalletSDK({
    appName: 'CoreChain',
    appLogoUrl: 'https://github.com/weslleymirandadev.png',
});

export function useWalletConnection() {
    const dispatch = useDispatch<AppDispatch>();
    const { isConnected, address, walletType } = useSelector((state: RootState) => state.wallet);

    // Check if the wallet is still connected when the page loads
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (!isConnected) return;

            try {
                let currentAddress: string | null = null;

                // Check based on wallet type
                switch (walletType) {
                    case 'MetaMask':
                        if (window.ethereum) {
                            const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
                            currentAddress = accounts[0] || null;
                        }
                        break;
                    case 'Phantom':
                        if (window.phantom?.ethereum) {
                            const accounts = await window.phantom.ethereum.request({ method: 'eth_accounts' }) as string[];
                            currentAddress = accounts[0] || null;
                        }
                        break;
                    case 'Coinbase Wallet':
                        const provider = coinbaseWallet.getProvider();
                        const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
                        currentAddress = accounts[0] || null;
                        break;
                }

                // If the address changed or is no longer connected, disconnect
                if (!currentAddress || currentAddress !== address) {
                    dispatch(disconnectWallet());
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
                // If there is an error, disconnect for safety
                dispatch(disconnectWallet());
            }
        };

        // Check connection when the page loads
        checkWalletConnection();

        // Listen for account changes (especially for MetaMask)
        if (window.ethereum && walletType === 'MetaMask') {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    // User disconnected the wallet
                    dispatch(disconnectWallet());
                } else if (accounts[0] !== address) {
                    // User switched account
                    dispatch(connectWallet({ 
                        address: accounts[0], 
                        walletType: 'MetaMask' 
                    }));
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, [dispatch, isConnected, address, walletType]);

    return { isConnected, address, walletType };
} 