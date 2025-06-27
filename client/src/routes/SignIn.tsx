import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { connectWallet, clearWalletError, restoreWalletState } from '../store/walletSlice';
import api from "../services/api";
import { ethers } from "ethers";
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SiHiveBlockchain } from "react-icons/si";

// Fix window.ethereum typing
declare global {
    interface Window {
        ethereum?: any;
        phantom?: any;
    }
}

const schema = z.object({
    email: z.string().email({ message: "Invalid E-mail" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

// Configuração do Coinbase Wallet SDK
const coinbaseWallet = createCoinbaseWalletSDK({
    appName: 'CoreChain',
    appLogoUrl: 'https://github.com/weslleymirandadev.png',
});

export function SignIn() {
    const [ethAddress, setEthAddress] = useState<string | null>(null);
    const [ethError, setEthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { isConnected, address, walletType } = useSelector((state: RootState) => state.wallet);
    
    const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const walletConnected = Boolean(ethAddress);
    const canSignIn = isValid && walletConnected;

    useEffect(() => {
        if (location.state?.fromSignUp) {
            setWelcomeMessage("Account created successfully! Please sign in with your credentials.");
        }
    }, [location]);

    // Restaurar estado da carteira ao carregar a página
    useEffect(() => {
        const savedWalletState = localStorage.getItem('walletState');
        if (savedWalletState && !isConnected) {
            try {
                const parsed = JSON.parse(savedWalletState);
                if (parsed.address && parsed.walletType) {
                    dispatch(restoreWalletState({
                        address: parsed.address,
                        walletType: parsed.walletType
                    }));
                    setEthAddress(parsed.address);
                    setConnectedWallet(parsed.walletType);
                }
            } catch (error) {
                console.error('Error restoring wallet state:', error);
            }
        }
    }, [dispatch, isConnected]);

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        setError(null);
        dispatch(clearWalletError());

        try {
            const response = await api.post('/auth/signin', {
                email: data.email,
                password: data.password,
            });

            login(response.data.access_token, response.data.user);
            
            // Se a carteira estiver conectada, garantir que o estado seja mantido
            if (isConnected && address && walletType) {
                dispatch(restoreWalletState({
                    address: address,
                    walletType: walletType
                }));
            }
            
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 403) {
                setError("Invalid credentials");
            } else {
                setError("An error occurred during sign in");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function connectMetaMask() {
        setEthError(null);
        try {
            if (!window.ethereum) {
                setEthError("MetaMask not found");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setEthAddress(accounts[0]);
            setConnectedWallet("MetaMask");
            dispatch(connectWallet({ address: accounts[0], walletType: "MetaMask" }));
        } catch (err: any) {
            setEthError(err.message || "Error connecting to MetaMask");
        }
    }

    async function connectPhantom() {
        setEthError(null);
        try {
            if (!window.phantom?.ethereum) {
                setEthError("Phantom not found");
                return;
            }
            const provider = new ethers.BrowserProvider(window.phantom.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setEthAddress(accounts[0]);
            setConnectedWallet("Phantom");
            dispatch(connectWallet({ address: accounts[0], walletType: "Phantom" }));
        } catch (err: any) {
            setEthError(err.message || "Error connecting to Phantom");
        }
    }

    async function connectCoinbaseWallet() {
        setEthError(null);
        try {
            const provider = coinbaseWallet.getProvider();
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            setEthAddress(address);
            setConnectedWallet("Coinbase Wallet");
            dispatch(connectWallet({ address: address, walletType: "Coinbase Wallet" }));
        } catch (err: any) {
            setEthError(err.message || "Error connecting to Coinbase Wallet");
        }
    }

    return (
        <main className="flex justify-center items-center align-middle w-full min-h-screen">
            <section className="max-w-[350px] w-full p-4 bg-white rounded shadow-md">
                <h1 className="text-3xl flex items-center gap-2 mb-5 font-bold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
                    <SiHiveBlockchain className="text-blue-600" />
                    Sign In
                </h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                {welcomeMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                        {welcomeMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                            autoComplete="email"
                            placeholder=" "
                        />
                        <label className="absolute left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            E-mail<span className="text-red-500">*</span>
                        </label>
                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer pr-10"
                            autoComplete="current-password"
                            placeholder=" "
                        />
                        <label className="absolute left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                    </div>
                    <div className="mt-2 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-600 mb-2">Connect your wallet<span className="text-red-500">*</span>:</p>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <button
                                onClick={connectMetaMask}
                                className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition ${connectedWallet === "MetaMask"
                                    ? 'bg-orange-500 text-white cursor-default'
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                    }`}
                                type="button"
                                disabled={walletConnected}
                            >
                                <img src="metamask.svg" className="max-w-[20px]" alt="metamask" />
                                <span className="text-xs">MetaMask</span>
                            </button>
                            <button
                                onClick={connectPhantom}
                                className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition ${connectedWallet === "Phantom"
                                    ? 'bg-purple-500 text-white cursor-default'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                    }`}
                                type="button"
                                disabled={walletConnected}
                            >
                                <img src="phantom.svg" className="max-w-[20px] rounded-md" alt="phantom wallet" />
                                <span className="text-xs">Phantom</span>
                            </button>
                            <button
                                onClick={connectCoinbaseWallet}
                                className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition ${connectedWallet === "Coinbase Wallet"
                                    ? 'bg-blue-500 text-white cursor-default'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                    }`}
                                type="button"
                                disabled={walletConnected}
                            >
                                <img src="coinwallet.png" className="max-w-[20px]" alt="coinbase wallet" />
                                <span className="text-xs">Coinbase Wallet</span>
                            </button>
                        </div>
                        {ethAddress && (
                            <div className="text-center">
                                <span className="text-xs text-green-600 font-medium">{connectedWallet} connected</span>
                                <div className="text-xs text-green-600 break-all mt-1">{ethAddress}</div>
                            </div>
                        )}
                        {ethError && (
                            <span className="text-xs text-red-500">{ethError}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-2 rounded font-semibold transition ${!canSignIn ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-500'}`}
                        disabled={!canSignIn || isSubmitting || isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="relative mt-5 flex flex-col justify-between items-center">
                    <hr className="border border-stone-300 absolute w-full" />
                    <p className="text-stone-300 absolute m-0 bg-white p-1 font-bold top-[-15px]">OR</p>
                </div>

                <p className="mt-5 text-gray-600">Don't have an account yet?</p>

                <Link
                    to="/sign-up"
                    className="inline-block w-full text-center mt-2 px-4 py-2 rounded bg-gradient-to-br from-blue-600 to-indigo-400 text-white font-semibold"
                >
                    Sign up
                </Link>
            </section>
        </main>
    );
}