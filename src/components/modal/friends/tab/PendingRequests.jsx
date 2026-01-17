import Image from "next/image";
import {UserX} from "lucide-react";

const PendingRequests = ({pendingRequests, handleCancelRequest}) => {
    return (
        <div>
            {pendingRequests.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingRequests.map(request => (
                        <div key={request.id}
                             className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg overflow-hidden">
                                    <Image
                                        src={request.avatar || '/default-avatar.png'}
                                        alt={request.nickname || 'Avatar'}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">@{request.nickname}</p>
                                    <p className="text-xs text-gray-500">En attente de réponse</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCancelRequest(request.id)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <UserX className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">Aucune demande en attente</p>
            )}
        </div>
    );
}

export default PendingRequests;