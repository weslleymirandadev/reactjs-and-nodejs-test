import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { OrbitControls } from '@react-three/drei';
import { Canvas } from "@react-three/fiber";
import Ether from "../components/3D/Ether";
import Header from "../components/Header";
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import gsap from "gsap";
import {
    EffectComposer,
    Bloom,
    ToneMapping,
} from "@react-three/postprocessing";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
    const [controlsEnabled, setControlsEnabled] = useState(true);
    const [ether, setEther] = useState<number>();
    const canvasRef = useRef<HTMLDivElement>(null);
    const tooltipVisible = useSelector((state: RootState) => state.etherTooltip.visible);


    useEffect(() => {
        const fetchEtherValue = async () => {
            await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
                .then(response => response.json())
                .then(value => setEther(Number(value.USD)))
        }

        fetchEtherValue()
    }, [])

    function handleInteract() {
        setControlsEnabled(true);
        if (canvasRef.current) {
            gsap.fromTo(
                canvasRef.current,
                { scale: 0.95 },
                { scale: 1, duration: 0.3, ease: "power2.out" }
            );
        }
    }

    function handleClose() {
        setControlsEnabled(false);
        if (canvasRef.current) {
            gsap.to(canvasRef.current, { scale: 0.95, duration: 0.3, ease: "power2.in" });
        }
    }

    return (
        <>
            <Header />

            <section className="w-full h-32 overflow-hidden relative">
                <img src="banner.jpg" alt="network" className="w-full h-full object-cover object-center" />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: "linear-gradient(to top, #D6D9DD 0px, #D6D9DD 10px, transparent 80px)",
                        zIndex: 2,
                        mixBlendMode: "lighten",
                    }}
                />
            </section>

            <motion.section
                className="flex sm:flex-row flex-col p-4 w-full justify-center align-middle items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}

            >
                <div className="relative max-w-[300px] max-h-[300px]">
                    <AnimatePresence>
                        {tooltipVisible && controlsEnabled && (
                            <motion.div
                                key="ether-tooltip"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="absolute sm:left-70 left-32 top-2 -translate-x-1/2 bg-slate-800/95 text-white px-4 py-2 rounded-lg text-[10px] sm:text-sm z-20 shadow-lg pointer-events-none "
                                style={{ minWidth: 'min(70vw, 220px)', maxWidth: 'min(90vw, 350px)', boxSizing: 'border-box' }}
                            >
                                <span className="font-bold">Ethereum</span>
                                <br />
                                Decentralized blockchain platform that enables the creation
                                of smart contracts and decentralized applications (dApps). Ether
                                (ETH) is its native cryptocurrency. Ether's current value is {ether !== undefined ? ether.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '...'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {!controlsEnabled && (
                            <motion.button
                                key="interact"
                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                onClick={handleInteract}
                                className="absolute top-4 left-4 z-10 px-2 py-1 text-xs rounded-md bg-slate-800/80 text-white border-none cursor-pointer"
                            >
                                Interact
                            </motion.button>
                        )}
                        {controlsEnabled && (
                            <motion.button
                                key="close"
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-slate-800/80 text-white border-none font-bold text-base cursor-pointer flex items-center justify-center"
                                aria-label="Close interaction"
                            >
                                x
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <motion.div
                        ref={canvasRef}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: controlsEnabled ? 1 : 0.7 }}
                        transition={{ duration: 0.3 }}
                        className="w-[300px] h-[300px]"
                    >
                        <Canvas
                            camera={{ position: [15, 0, 0], rotation: [-0.2, 0.4, 0.1] }}
                            className="bg-bg-3 rounded-xl w-full h-full"
                        >
                            <directionalLight />
                            <ambientLight intensity={0.5} />
                            <Ether enabled={controlsEnabled} />
                            {controlsEnabled && <OrbitControls enableDamping dampingFactor={0.1} />}
                            <EffectComposer>
                                <Bloom mipmapBlur luminanceThreshold={0} levels={7} intensity={0.8} />
                                <ToneMapping />
                            </EffectComposer>
                            <fog attach="fog" args={["blue", 10, 100]} />
                        </Canvas>
                    </motion.div>
                </div>

                <div className="p-4 text-main-text font-[600] min-h-[300px]">
                    <h2 className="font-title text-5xl bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">Welcome!</h2>
                    <p className="mb-5">Welcome to <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">CoreChain</span>, your gateway to the new era of Web3 Technologies!</p>
                    <p className="mb-5">Explore an innovative ecosystem where you can discover, learn, and interact with the latest trends in blockchain and smart contracts.</p>
                    <p className="mb-5">To unlock all features and personalize your experience, join us now!</p>
                    <Link
                        to="/sign-up"
                        className="transition ease-in-out duration-200 hover:scale-110 shadow-md hover:shadow-indigo-400 inline-block mt-2 px-4 py-2 rounded bg-gradient-to-br from-blue-600 to-indigo-400 text-white font-semibold"
                    >
                        Sign up Now!
                    </Link>
                </div>
            </motion.section>

            <Footer />
        </>
    );
}