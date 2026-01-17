import Image from "next/image.d.ts";
import {Trash2, Users} from "lucide-react";

const AuthFriendsListTab = ({ friends, onRemoveFriend }) => {

    return (
        <div className="space-y-3">
            {friends.length > 0 ? (
                friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
                                    src={friend.avatar || '/default-avatar.png'}
                                    alt={friend.nickname}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">@{friend.nickname}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Supprimer l'ami"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Aucun ami pour le moment</p>
                    <p className="text-sm text-gray-400">Utilisez la recherche pour ajouter des amis</p>
                </div>
            )}
        </div>
    )
}

export default AuthFriendsListTab;