import {useState} from "react";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/AuthProvider.jsx";
import {Users, UserPlus, UserCheck, X, Bell} from "lucide-react";
import Image from "next/image";

const FriendsButton = ({isHydrated, setShowFriendsModal, friendRequests, onlineFriends, handleAcceptRequest, handleDeclineRequest}) => {

    const [showFriendMenu, setShowFriendMenu] = useState(false);
    const router = useRouter();
    const auth = useAuth();

    if (!isHydrated || !auth.user) return null;

    const handleJoinFriendGame = (gameId) => {
        setShowFriendMenu(false);
        router.push(`/game/${gameId}`);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowFriendMenu(!showFriendMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
                aria-label="Amis"
            >
                <Users className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
                {friendRequests.length > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {friendRequests.length}
                    </span>
                )}
            </button>

            {showFriendMenu && (
                <div
                    className="absolute right-0 top-12 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-3 z-50">
                    <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">Amis</h3>
                            <button
                                onClick={() => setShowFriendsModal(true)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Voir tout
                            </button>
                        </div>
                    </div>

                    {friendRequests.length > 0 && (
                        <div
                            className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Demandes d'amis
                                </h4>
                                <Bell className="w-4 h-4 text-blue-500"/>
                            </div>
                            <div className="space-y-2">
                                {friendRequests.slice(0, 2).map(request => (
                                    <div key={request.id}
                                         className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <Image
                                                    src={request.avatar || '/default-avatar.png'}
                                                    alt={request.nickname}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    @{request.nickname}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                                                aria-label="Accepter"
                                            >
                                                <UserCheck className="w-4 h-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleDeclineRequest(request.id)}
                                                className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                                                aria-label="Décliner"
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/*<div className="px-4 py-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            En ligne ({onlineFriends.length})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {onlineFriends.map(friend => (
                                <div key={friend.id}
                                     className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div
                                                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                {friend.avatar}
                                            </div>
                                            <div
                                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-800"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {friend.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {friend.status}
                                                {friend.gameId && (
                                                    <span
                                                        className="text-blue-500 ml-1">• #{friend.gameId}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {friend.gameId && (
                                        <button
                                            onClick={() => handleJoinFriendGame(friend.gameId)}
                                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                                        >
                                            Rejoindre
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>*/}

                    <div className="px-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => {
                                setShowFriendMenu(false);
                                setShowFriendsModal(true);
                            }}
                            className="w-full py-2 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <UserPlus className="w-4 h-4 inline mr-2"/>
                            Ajouter des amis
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FriendsButton;