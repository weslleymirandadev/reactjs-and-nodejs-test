import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWalletConnection } from '../hooks/useWalletConnection';
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { FaUser, FaEnvelope, FaWallet, FaCalendar, FaUsers } from "react-icons/fa";
import Footer from "../components/Footer";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface Meeting {
    id: string;
    title: string;
    description: string;
    date: string;
    participants: Array<{
        id: string;
        joinedAt: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
}

export function User() {
    const { logout, isAdmin } = useAuth();
    const { isConnected, address } = useWalletConnection();
    const [user, setUser] = useState<User | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userResponse, meetingsResponse] = await Promise.all([
                api.get('/users/me'),
                api.get('/meetings')
            ]);
            setUser(userResponse.data);
            setMeetings(meetingsResponse.data);
        } catch (err: any) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const isParticipant = (meeting: Meeting) => {
        return meeting.participants.some(p => p.user.id === user?.id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleJoinMeeting = async (meetingId: string) => {
        if (!address) {
            setError('Conecte sua carteira para participar da reunião.');
            return;
        }
        try {
            await api.post(`/meetings/${meetingId}/join`, {
                walletAddress: address
            });
            fetchData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                'Failed to join meeting'
            );
        }
    };

    const handleLeaveMeeting = async (meetingId: string) => {
        try {
            await api.delete(`/meetings/${meetingId}/leave`);
            fetchData();
        } catch (err) {
            setError('Failed to leave meeting');
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading user profile...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-6xl mx-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text mb-4">
                            User Profile
                        </h1>
                        <p className="text-lg text-gray-600">
                            Welcome to your CoreChain profile. Here you can view your account information and available meetings.
                        </p>
                    </motion.div>

                    {/* User Information Section - Compact */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-lg shadow-lg p-6 mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user?.role === 'admin'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-800">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaWallet className="text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Wallet Status</p>
                                    <p className="font-semibold text-gray-800">
                                        {isConnected ? 'Connected' : 'Not Connected'}
                                    </p>
                                </div>
                            </div>
                            {isConnected && (
                                <div className="flex items-center gap-2">
                                    <FaWallet className="text-purple-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-mono text-xs text-gray-800">
                                            {address?.slice(0, 6)}...{address?.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Available Meetings Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-green-600 text-2xl" />
                                <h2 className="text-2xl font-semibold text-gray-800">Available Meetings</h2>
                            </div>
                            {isAdmin && (
                                <Link
                                    to="/dashboard"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>

                        <div className="space-y-4">
                            {meetings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendar className="text-4xl mx-auto mb-4 text-gray-300" />
                                    <p>No meetings available at the moment.</p>
                                </div>
                            ) : (
                                meetings.map((meeting) => (
                                    <motion.div
                                        key={meeting.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>
                                                    {isParticipant(meeting) && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            Joined
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-3">{meeting.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendar />
                                                        {formatDate(meeting.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaUsers />
                                                        {meeting.participants.length} participants
                                                    </div>
                                                </div>

                                                <div className="mt-2">
                                                    {isParticipant(meeting) ? (
                                                        <button
                                                            onClick={() => handleLeaveMeeting(meeting.id)}
                                                            className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                                                        >
                                                            Leave
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleJoinMeeting(meeting.id)}
                                                            className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                                                            disabled={!address}
                                                        >
                                                            Participate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </>
    );
} 