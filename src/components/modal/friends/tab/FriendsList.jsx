import Image from "next/image";
import {UserMinus} from "lucide-react";

const FriendsList = ({friends, handleRemoveFriend}) => {


    return (
        <div>
            {friends.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {friends.map(friend => (
                        <div key={friend.id}
                             className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
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
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">@{friend.nickname}</p>
                                    <p className="text-sm text-gray-500">{friend.bio}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveFriend(friend.id)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <UserMinus className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">Aucun ami pour le moment</p>
            )}
        </div>
    );
}

export default FriendsList;