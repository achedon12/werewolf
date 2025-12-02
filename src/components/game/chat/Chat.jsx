import TabMessages from "@/components/game/chat/tab/TabMessages";
import TabParticipants from "@/components/game/chat/tab/TabParticipants";
import {MessageSquare, Users} from "lucide-react";

const GameChat = ({
                      chatChannels,
                      chatMessages,
                      chatMessage,
                      participantsForChannel,
                      currentChannel,
                      chatSubTab,
                      chatContainerRef,
                      switchChannel = () => {
                      },
                      setChatSubTab = () => {
                      },
                      setChatMessage = () => {
                      },
                      sendChatMessage = () => {
                      },
                      currentPlayer
                  }) => {

    return (
        <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 mt-6">
            <div className="card-body flex flex-col p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400"/>
                        </div>
                        <h3 className="card-title text-gray-900 dark:text-white text-lg md:text-xl">
                            Chat de la partie
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {chatChannels.length === 0 && (
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                Aucun canal de chat disponible
                            </div>
                        )}
                        {chatChannels.map(ch => (
                            <button
                                key={ch}
                                onClick={() => switchChannel(ch)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    currentChannel === ch
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>

                {chatChannels.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">💬</div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vous n'avez pas accès à des canaux de chat pour le moment.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="tabs-boxed bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 mb-4 md:mb-6 flex">
                            <button
                                onClick={() => setChatSubTab('messages')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 ${
                                    chatSubTab === 'messages'
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                            >
                                <MessageSquare className="h-4 w-4"/>
                                <span>Messages</span>
                            </button>
                            <button
                                onClick={() => setChatSubTab('participants')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 ${
                                    chatSubTab === 'participants'
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                            >
                                <Users className="h-4 w-4"/>
                                <span>Participants</span>
                            </button>
                        </div>

                        <div className="flex-1 mb-2 md:mb-4 min-h-0">
                            {chatSubTab === 'messages' && (
                                <TabMessages
                                    chatMessages={chatMessages}
                                    currentChannel={currentChannel}
                                    chatContainerRef={chatContainerRef}
                                />
                            )}
                            {chatSubTab === 'participants' && (
                                <TabParticipants
                                    participantsForChannel={participantsForChannel}
                                    currentChannel={currentChannel}
                                    currentPlayer={currentPlayer}
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder={`Écrivez votre message sur ${currentChannel}...`}
                                className="input flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 p-3 pr-10 rounded-lg shadow-sm"
                                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                            />
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Canal actuel : <span
                                className="font-semibold text-blue-600 dark:text-blue-400">{currentChannel}</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default GameChat;