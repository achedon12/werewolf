'use client';

import {useEffect, useState} from 'react';
import {Search, UserCheck, UserMinus, UserPlus, Users, UserX, X} from 'lucide-react';
import Image from "next/image";
import {useAuth} from "@/app/AuthProvider.jsx";
import FriendsRequests from "@/components/modal/friends/tab/FriendsRequests.jsx";
import FriendsList from "@/components/modal/friends/tab/FriendsList.jsx";
import FriendsOnline from "@/components/modal/friends/tab/FriendsOnline.jsx";
import PendingRequests from "@/components/modal/friends/tab/PendingRequests.jsx";
import {toast} from "react-toastify";

const FriendsModal = ({show, setShow, friendRequests, onAcceptRequest, onDeclineRequest}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('requests');
    const {user} = useAuth();

    useEffect(() => {
        if (!show) return;
        fetchFriends();
        fetchPendingRequests();
    }, [show]);

    useEffect(() => {
        if (searchQuery.trim()) {
            setActiveTab('search');
        }
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                return;
            }
            if (searchQuery.length < 3) {
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`/api/user?search=${encodeURIComponent(searchQuery)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.users?.filter(u => u.nickname !== user.nickname) || []);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, user?.nickname]);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Erreur lors de la récupération des amis');
                return;
            }

            const data = await response.json();
            setFriends(data.friends || []);
            setOnlineFriends(data.friends?.filter(f => f.status === 'online') || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/friends/request/sent', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Erreur lors de la récupération des demandes en attente');
                return;
            }

            const data = await response.json();
            setPendingRequests(data.pendingRequests || []);
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
                body: JSON.stringify({friendId}),
            });

            if (response.ok) {
                setSearchResults(searchResults.filter(u => u.id !== friendId));
                setSearchQuery('');
                toast.success('Demande d\'ami envoyée');
                fetchPendingRequests();
            }
        } catch (error) {
            console.error('Erreur:', error);
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

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error || 'Erreur lors de la suppression de l\'ami');
                return;
            }

            toast.success(data.message || 'Ami supprimé avec succès');
            fetchFriends();
        } catch (error) {
            console.error('Erreur:', error);
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

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error || 'Erreur lors de l\'annulation');
                return;
            }

            toast.info('Demande annulée');
            setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShow(false)}
            />

            <div
                className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6"/>
                            Amis
                        </h2>
                        <button
                            onClick={() => setShow(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Rechercher ou ajouter un ami..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {searchQuery.trim() && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Résultats de recherche
                            </h3>
                            {isLoading ? (
                                <p className="text-gray-500 text-center py-4">Chargement...</p>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {searchResults.map(u => (
                                        <div key={u.id}
                                             className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg overflow-hidden">
                                                    <Image
                                                        src={u.avatar || '/default-avatar.png'}
                                                        alt={u.nickname || 'Avatar'}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{u.nickname}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddFriend(u.id)}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm">
                                                <UserPlus className="w-4 h-4"/>
                                                Ajouter
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Aucun utilisateur trouvé</p>
                            )}
                        </div>
                    )}

                    {!searchQuery.trim() && (
                        <>
                            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === 'requests'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Reçues {friendRequests.length > 0 && `(${friendRequests.length})`}
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === 'pending'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Envoyées {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                                </button>
                                <button
                                    onClick={() => setActiveTab('friends')}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === 'friends'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Tous ({friends.length})
                                </button>
                                {/*<button
                                    onClick={() => setActiveTab('online')}
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === 'online'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                                >
                                    En ligne ({onlineFriends.length})
                                </button>*/}
                            </div>

                            {activeTab === 'requests' && <FriendsRequests friendRequests={friendRequests} onAcceptRequest={onAcceptRequest} onDeclineRequest={onDeclineRequest} /> }

                            {activeTab === 'pending' && <PendingRequests pendingRequests={pendingRequests} handleCancelRequest={handleCancelRequest} /> }

                            {activeTab === 'friends' && <FriendsList friends={friends} handleRemoveFriend={handleRemoveFriend} /> }

                            {/*{activeTab === 'online' && <FriendsOnline onlineFriends={onlineFriends} /> }*/}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FriendsModal;