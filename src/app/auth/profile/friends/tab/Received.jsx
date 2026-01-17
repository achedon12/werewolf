import Image from "next/image.d.ts";
import {Inbox, UserCheck, UserX} from "lucide-react";

const AuthFriendsReceivedTab = ({ friendRequests, onAcceptRequest, onDeclineRequest }) => {

    return (
        <div className="space-y-3">
            {friendRequests.length > 0 ? (
                friendRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-4">
                            <Image
                                src={request.avatar || '/default-avatar.png'}
                                alt={request.nickname}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">@{request.nickname}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <UserCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Accepter</span>
                            </button>
                            <button
                                onClick={() => handleDeclineRequest(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                <UserX className="w-4 h-4" />
                                <span className="hidden sm:inline">Refuser</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Inbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Aucune demande reçue</p>
                </div>
            )}
        </div>
    )
}

export default AuthFriendsReceivedTab;