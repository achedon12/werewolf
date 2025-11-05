import TabMessages from "@/components/game/chat/tab/TabMessages";
import TabParticipants from "@/components/game/chat/tab/TabParticipants";
import {MessageSquare} from "lucide-react";

const GameChat = ({chatChannels, chatMessages, chatMessage, participantsForChannel, currentChannel, chatSubTab, chatContainerRef, switchChannel = () => {}, setChatSubTab = () => {}, setChatMessage = () => {}, sendChatMessage = () => {}, currentPlayer}) => {

    return (
        <div
            className="card glass shadow-2xl backdrop-blur-sm border border-white/10 mt-6">
            <div className="card-body flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-title text-white mb-4">
                        <MessageSquare className="inline-block mr-2"/>
                        Chat
                    </h3>

                    <div className="flex gap-2 mb-4">
                        {chatChannels.length === 0 && (
                            <div className="text-gray-400 text-sm">Aucun canal de chat disponible</div>
                        )}
                        {chatChannels.map(ch => (
                            <button
                                key={ch}
                                className={`btn btn-sm ${currentChannel === ch ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => switchChannel(ch)}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>

                {chatChannels.length === 0 ? (
                    <div className="text-gray-400 text-sm mb-4">Vous n'avez pas accès à des canaux de chat pour le moment.</div>
                ) : (
                    <>
                        <div className="tabs mb-3 border-b border-white/10">
                            <button
                                className={`tab ${chatSubTab === 'messages' ? 'tab-active' : ''}`}
                                onClick={() => setChatSubTab('messages')}
                            >
                                Messages
                            </button>
                            <button
                                className={`tab ${chatSubTab === 'participants' ? 'tab-active' : ''}`}
                                onClick={() => setChatSubTab('participants')}
                            >
                                Participants
                            </button>
                        </div>

                        {chatSubTab === 'messages' && <TabMessages chatMessages={chatMessages} currentChannel={currentChannel} chatContainerRef={chatContainerRef}/>}

                        {chatSubTab === 'participants' && <TabParticipants participantsForChannel={participantsForChannel} currentChannel={currentChannel} currentPlayer={currentPlayer}/>}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder={`Message sur ${currentChannel}...`}
                                className="input input-bordered flex-1 bg-base-200/50"
                                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                            />
                            <button
                                onClick={sendChatMessage}
                                className="btn btn-primary"
                            >
                                Envoyer
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default GameChat;