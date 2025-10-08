import {formatTime} from "@/utils/Date";

const Message = ({index, msg}) => {
    return (
        <div
             className={`p-3 rounded-lg ${msg.type === 'system' ? 'bg-yellow-500/10' : 'bg-base-200/30'}`}>
            <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-purple-400">
                            @{msg.playerName}
                        </span>
                <span className="text-gray-400 text-xs">
                            {formatTime(msg.createdAt)}
                        </span>
            </div>
            <p className="text-gray-300 text-sm">{msg.message}</p>
        </div>
    );
}

export default Message;