'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, UserCheck, UserX, Clock, Inbox, Send, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import AuthFriendsSentTab from "@/app/auth/profile/friends/tab/Sent.jsx";
import AuthFriendsReceivedTab from "@/app/auth/profile/friends/tab/Received.jsx";
import AuthFriendsListTab from "@/app/auth/profile/friends/tab/Friends.jsx";
import {useAuth} from "@/app/AuthProvider.jsx";

const FriendsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');
    const {user} = useAuth();

    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
        fetchPendingRequests();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const searchUsers = async () => {
            if (searchQuery.length < 3) return;

            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/user?search=${encodeURIComponent(searchQuery)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.users?.filter(u => u.nickname !== user.nickname) || []);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFriends(data.friends || []);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends/request', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data.friendRequests || []);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends/request/sent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPendingRequests(data.pendingRequests || []);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId }),
            });

            if (response.ok) {
                toast.success('Demande d\'ami envoyée');
                setSearchResults(searchResults.filter(u => u.id !== friendId));
                setSearchQuery('');
                fetchPendingRequests();
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi de la demande');
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/request/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success('Demande acceptée');
                fetchFriendRequests();
                fetchFriends();
            }
        } catch (error) {
            toast.error('Erreur lors de l\'acceptation');
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/request/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.info('Demande refusée');
                setFriendRequests(friendRequests.filter(req => req.id !== requestId));
            }
        } catch (error) {
            toast.error('Erreur lors du refus');
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/request/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.info('Demande annulée');
                setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
            }
        } catch (error) {
            toast.error('Erreur lors de l\'annulation');
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/friends/${friendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success('Ami supprimé');
                fetchFriends();
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const tabs = [
        { id: 'friends', label: 'Mes amis', icon: Users, count: friends.length },
        { id: 'received', label: 'Reçues', icon: Inbox, count: friendRequests.length },
        { id: 'sent', label: 'Envoyées', icon: Send, count: pendingRequests.length },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <Users className="w-8 h-8 text-white" />
                    </div>Mes Amis
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gérez vos amis et vos demandes
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur à ajouter..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {searchQuery.trim() && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Résultats de recherche
                            </h4>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {searchResults.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <Image
                                                    src={user.avatar || '/default-avatar.png'}
                                                    alt={user.nickname}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">@{user.nickname}</p>
                                                    <p className="text-sm text-gray-500">{user?.bio}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddFriend(user.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Ajouter
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium text-sm transition-all relative ${
                                activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    activeTab === tab.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'friends' && <AuthFriendsListTab friends={friends} onRemoveFriend={handleRemoveFriend} />}

                    {activeTab === 'received' && <AuthFriendsReceivedTab
                        onAcceptRequest={handleAcceptRequest}
                        onDeclineRequest={handleDeclineRequest}
                        friendRequests={friendRequests}
                    />}

                    {activeTab === 'sent' && <AuthFriendsSentTab onCancelRequest={handleCancelRequest} pendingRequests={pendingRequests} />}
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;