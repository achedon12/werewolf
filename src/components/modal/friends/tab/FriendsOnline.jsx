import Image from "next/image";


const FriendsOnline = ({onlineFriends}) => {

    return (
        <div>
            {onlineFriends.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {onlineFriends.map(friend => (
                        <div key={friend.id}
                             className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div
                                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg overflow-hidden">
                                        <Image
                                            src={friend.avatar || '/default-avatar.png'}
                                            alt={friend.nickname || 'Avatar'}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </div>
                                    <div
                                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"/>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">@{friend.nickname}</p>
                                    <p className="text-sm text-gray-500">En ligne</p>
                                </div>
                            </div>
                            <button
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                Inviter
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">Aucun ami en ligne</p>
            )}
        </div>
    )
}

export default FriendsOnline;