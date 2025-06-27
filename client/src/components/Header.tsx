import { SiHiveBlockchain } from "react-icons/si";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <>
            <header className="fixed z-20 w-full flex items-center justify-between bg-bg-3 p-4 border border-b-blue-600">
                <h1 className="flex gap-2 font-title text-5xl bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
                    <SiHiveBlockchain className="text-blue-600"/>
                    <span className="hidden xs:block">CoreChain</span>
                </h1>

                <nav>
                    <ul className="flex items-center gap-5">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <li className="text-white-softer hover:underline">
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                )}
                                <li className="text-white-softer hover:underline">
                                    <Link to="/">Home</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="text-white-softer hover:underline">
                                    <Link to="/sign-in">Sign In</Link>
                                </li>
                                <li className="hover:underline decoration-blue-600 font-bold bg-gradient-to-r from-blue-600 to-indigo-400 inline-block text-transparent bg-clip-text">
                                    <Link to="/sign-up">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            <div className="placeholder-container h-[80px]"></div>
        </>
    )
}