import {formatTime} from "@/utils/Date";
import Message from "@/components/game/chat/Message";

const TabMessages = ({chatMessages, currentChannel, chatContainerRef}) => {
    return (
        <div ref={chatContainerRef}
             className="flex-1 space-y-3 max-h-96 overflow-y-auto mb-4">
            {(chatMessages[currentChannel] || []).length === 0 && (
                <div className="text-gray-400 text-sm">
                    Aucun message pour le moment dans {currentChannel}.
                </div>
            )}
            {(chatMessages[currentChannel] || []).map((msg, index) => <Message key={index} msg={msg}/>)}
        </div>
    );
}

export default TabMessages