import Message from "@/components/game/chat/Message";

const TabMessages = ({chatMessages, currentChannel, chatContainerRef}) => {
    const messages = chatMessages[currentChannel] || [];
    const isEmpty = messages.length === 0;

    return (
        <div
            ref={chatContainerRef}
            className="flex-1 space-y-4 p-1"
        >
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div
                        className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                        Aucun message pour le moment
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Canal : <span className="font-semibold text-blue-600 dark:text-blue-400">{currentChannel}</span>
                    </p>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <Message
                        key={`${msg.createdAt}_${index}`}
                        msg={msg}
                        index={index}
                        isLast={index === messages.length - 1}
                    />
                ))
            )}
        </div>
    );
}

export default TabMessages;