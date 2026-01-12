import {formatTime} from "@/utils/Date";
import {useEffect, useState} from "react";
import {User} from "lucide-react";

const Message = ({msg, index, isLast, currentPlayer}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [maskedMessage, setMaskedMessage] = useState(msg.message);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 50);
        return () => clearTimeout(timer);
    }, [index]);

    useEffect(() => {
        if (currentPlayer?.role === "Petite Fille") {
            const letters = msg.message
                .split('')
                .map((char, idx) => ({char, idx, isLetter: /[a-zA-ZÀ-ÿ]/.test(char)}));

            const letterIndices = letters
                .filter(item => item.isLetter)
                .map(item => item.idx);

            const visibleCount = Math.ceil(letterIndices.length * 0.5);
            const visibleIndices = new Set();

            while (visibleIndices.size < visibleCount) {
                visibleIndices.add(
                    letterIndices[Math.floor(Math.random() * letterIndices.length)]
                );
            }

            setMaskedMessage(
                msg.message
                    .split('')
                    .map((char, idx) => {
                        if (/[a-zA-ZÀ-ÿ]/.test(char) && !visibleIndices.has(idx)) {
                            return '-';
                        }
                        return char;
                    })
                    .join('')
            );
        } else {
            setMaskedMessage(msg.message);
        }
    }, [msg.message, currentPlayer?.role]);

    return (
        <div
            className={`
                        relative transition-all duration-200 transform
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        hover:shadow-lg
                        ${isLast ? 'mb-2' : ''}
                    `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent dark:via-blue-500/10 rounded-lg"/>
            )}

            <div className={`
                        relative p-4 rounded-lg shadow-sm
                        bg-white dark:bg-gray-800/30 border-l-4 border-blue-500
                        transition-all duration-200
                        ${isHovered ? 'shadow-md' : ''}
                    `}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                        </div>
                        <div className="flex flex-col">
                                    <span
                                        className="font-semibold text-sm flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                        {msg.playerName}
                                    </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTime(msg.createdAt)}
                                    </span>
                        </div>
                    </div>
                </div>

                <div className="pl-6">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {maskedMessage}
                    </p>

                    {msg.message.includes('@') && (
                        <div
                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                            <span>📍 Mention</span>
                        </div>
                    )}
                </div>

                {isHovered && msg.channel && (
                    <div className="absolute bottom-2 right-2">
                                <span
                                    className="text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-0.5 rounded">
                                    {msg.channel}
                                </span>
                    </div>
                )}

                {isHovered && (
                    <div className="absolute top-2 right-2 opacity-70">
                                <span className="text-xs text-gray-400">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;