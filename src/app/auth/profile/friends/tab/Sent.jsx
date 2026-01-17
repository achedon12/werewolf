import Image from 'next/image';
import { Clock, Send } from 'lucide-react';

const AuthFriendsSentTab = ({ pendingRequests, onCancelRequest }) => {

    return (
        <div className="space-y-3">
            {pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
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
                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                                                <Clock className="w-4 h-4" />
                                                En attente
                                            </span>
                            <button
                                onClick={() => handleCancelRequest(request.id)}
                                className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Aucune demande envoyée</p>
                </div>
            )}
        </div>
    )
}

export default AuthFriendsSentTab;