import Image from "next/image";
import {Circle, CircleDot} from "lucide-react";

const TabParticipants = ({participantsForChannel, currentChannel, currentPlayer}) => {
    return (
        <div className="flex-1 mb-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {participantsForChannel(currentChannel).map(p => (
                    <div
                        key={p.socketId || p.id}
                        className={`p-3 rounded-lg bg-base-200/30 flex items-center gap-3`}
                    >
                        <div className="avatar">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Image
                                    src={p.isBot ? '/bot-avatar.png' : p.avatar || "/default-avatar.png"}
                                    alt={p.nickname} width={32} height={32}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-white">
                                {currentPlayer?.id === p.id ? `(Vous)` : p.nickname}
                            </div>
                            <div
                                className={`text-sm text-gray-400 ${p.isBot ? "italic" : p.online ? "text-green-400" : "text-gray-400"}`}
                            >
                                {p.isBot ? (
                                    <span className="italic">Bot</span>
                                ) : p.online ? (
                                    <div className="flex items-center">
                                        <CircleDot
                                            size={16}
                                            className="inline text-green-400 mr-1"
                                        />
                                        En ligne
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Circle
                                            size={16}
                                            className="inline text-gray-400 mr-1"
                                        />
                                        Hors ligne
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TabParticipants;