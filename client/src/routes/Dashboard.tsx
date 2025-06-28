import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWalletConnection } from '../hooks/useWalletConnection';
import api from '../services/api';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendar } from 'react-icons/fa';
import Footer from '../components/Footer';

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
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    participants: Array<{
        id: string;
        joinedAt: string;
        walletAddress?: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
}

interface CreateMeetingForm {
    title: string;
    description: string;
    date: string;
}

export function Dashboard() {
    const { token, user } = useAuth();
    const { isConnected, address } = useWalletConnection();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [formData, setFormData] = useState<CreateMeetingForm>({
        title: '',
        description: '',
        date: '',
    });

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const meetingsResponse = await api.get('/meetings');
                setMeetings(meetingsResponse.data);
            } catch (err: any) {
                setError('Failed to load meetings');
                console.error('Error fetching meetings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMeetings();
        }
    }, [token]);

    const handleCreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/meetings', formData);
            setMeetings([...meetings, response.data]);
            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                date: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create meeting');
        }
    };

    const handleUpdateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMeeting) return;

        try {
            const response = await api.put(`/meetings/${editingMeeting.id}`, formData);
            setMeetings(meetings.map(m => m.id === editingMeeting.id ? response.data : m));
            setEditingMeeting(null);
            setFormData({
                title: '',
                description: '',
                date: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update meeting');
        }
    };

    const handleDeleteMeeting = async (meetingId: string) => {
        if (!confirm('Are you sure you want to delete this meeting?')) return;

        try {
            await api.delete(`/meetings/${meetingId}`);
            setMeetings(meetings.filter(m => m.id !== meetingId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete meeting');
        }
    };

    const handleJoinMeeting = async (meetingId: string) => {
        try {
            await api.post(`/meetings/${meetingId}/join`, {
                walletAddress: address
            });
            // Refresh meetings to update participant count
            const response = await api.get('/meetings');
            setMeetings(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join meeting');
        }
    };

    const handleLeaveMeeting = async (meetingId: string) => {
        try {
            await api.delete(`/meetings/${meetingId}/leave`);
            // Refresh meetings to update participant count
            const response = await api.get('/meetings');
            setMeetings(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to leave meeting');
        }
    };

    const isParticipant = (meeting: Meeting) => {
        return meeting.participants.some(p => p.user.id === user?.id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
                <Footer />
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
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-6">
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md p-6 mb-6"
                        >
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text mb-4">
                                Welcome to your Dashboard
                            </h1>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">User Information</h2>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Username:</label>
                                            <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email:</label>
                                            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Role:</label>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Wallet Status</h2>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Status:</label>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isConnected ? 'Connected' : 'Not Connected'}
                                            </span>
                                        </div>
                                        {isConnected && address && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Address:</label>
                                                <p className="text-sm font-mono text-gray-800">
                                                    {address.slice(0, 6)}...{address.slice(-4)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Meetings Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Meetings</h2>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <FaPlus /> Create Meeting
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {/* Create/Edit Meeting Form */}
                        {(showCreateForm || editingMeeting) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-gray-50 rounded-lg"
                            >
                                <h3 className="text-lg font-semibold mb-4">
                                    {editingMeeting ? 'Edit Meeting' : 'Create New Meeting'}
                                </h3>
                                <form onSubmit={editingMeeting ? handleUpdateMeeting : handleCreateMeeting} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            {editingMeeting ? 'Update Meeting' : 'Create Meeting'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setEditingMeeting(null);
                                                setFormData({
                                                    title: '',
                                                    description: '',
                                                    date: '',
                                                });
                                            }}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Meetings List */}
                        <div className="space-y-4">
                            {meetings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendar className="text-4xl mx-auto mb-4 text-gray-300" />
                                    <p>No meetings scheduled yet.</p>
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
                                                    {user?.role === 'admin' && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            Admin
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
                                            </div>

                                            <div className="flex gap-2">
                                                {!isParticipant(meeting) ? (
                                                    <button
                                                        onClick={() => handleJoinMeeting(meeting.id)}
                                                        disabled={!isConnected}
                                                        className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Join
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleLeaveMeeting(meeting.id)}
                                                        className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                                    >
                                                        Leave
                                                    </button>
                                                )}

                                                {user?.role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMeeting(meeting);
                                                                setFormData({
                                                                    title: meeting.title,
                                                                    description: meeting.description,
                                                                    date: meeting.date.slice(0, 16),
                                                                });
                                                            }}
                                                            className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMeeting(meeting.id)}
                                                            className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Participants List (Admin Only) */}
                                        {user?.role === 'admin' && meeting.participants.length > 0 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Participants:</h4>
                                                <div className="grid md:grid-cols-2 gap-2">
                                                    {meeting.participants.map((participant) => (
                                                        <div key={participant.id} className="text-sm bg-gray-50 p-2 rounded">
                                                            <div className="font-medium">{participant.user.username}</div>
                                                            <div className="text-gray-600">{participant.user.email}</div>
                                                            {participant.walletAddress && (
                                                                <div className="text-xs text-gray-500 font-mono">
                                                                    {participant.walletAddress.slice(0, 6)}...{participant.walletAddress.slice(-4)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
} 