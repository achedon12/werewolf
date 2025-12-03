import Image from 'next/image';
import {GAME_PHASES, GAME_STATES} from "@/server/config/constants.js";
import {useState} from "react";
import {
    Calendar,
    CircleQuestionMark,
    Clock,
    Copy,
    Crown,
    Flag,
    Gamepad2,
    Hourglass, Moon, Repeat,
    Share2, Sun, Target,
    Users,
    Vote
} from "lucide-react";
import {siteUrl} from "@/utils/publicEmail.js";

const GameHeader = ({game, players, configuration, creator}) => {
    const [copied, setCopied] = useState(false);
    const alivePlayers = players.filter(player => player.isAlive);
    const parsedConfiguration = configuration || {};
    const maxPlayers = Object.values(parsedConfiguration).reduce((a, b) => a + b, 0) || 0;

    const copyUrl = async () => {
        const url = `${siteUrl}/game/${game.id}`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy URL:', error);
        }
    };

    const getStatusBadge = () => {
        switch (game.state) {
            case GAME_STATES.WAITING:
                return {
                    label: "En attente",
                    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                    icon: <Hourglass className="w-4 h-4"/>
                };
            case GAME_STATES.IN_PROGRESS:
                return {
                    label: "En cours",
                    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                    icon: <Gamepad2 className="w-4 h-4"/>
                };
            case GAME_STATES.FINISHED:
                return {
                    label: "Terminée",
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
                    icon: <Crown className="w-4 h-4"/>
                };
            default:
                return {
                    label: game.state,
                    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                    icon: <CircleQuestionMark className="w-4 h-4" />
                };
        }
    };

    const getPhaseBadge = () => {
        if (game.state === GAME_STATES.WAITING) {
            return {
                label: game.type || "Classique",
                color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                icon: <Target className="w-4 h-4" />
            };
        }

        switch (game.phase) {
            case GAME_PHASES.NIGHT:
                return {
                    label: "Nuit",
                    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                    icon: <Moon className="w-4 h-4" />
                };
            case GAME_PHASES.DAY:
                return {
                    label: "Jour",
                    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                    icon: <Sun className="w-4 h-4" />
                };
            case GAME_PHASES.VOTING:
                return {
                    label: "Vote",
                    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                    icon: <Vote className="w-4 h-4" />
                };
            case GAME_PHASES.FINISHED:
                return {
                    label: "Terminée",
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
                    icon: <Flag className="w-4 h-4" />
                };
            default:
                return {
                    label: game.phase || "Phase",
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
                    icon: <Repeat className="w-4 h-4" />
                };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const status = getStatusBadge();
    const phase = getPhaseBadge();

    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                                        {game.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            <span>{status.icon}</span>
                                            {status.label}
                                        </span>

                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${phase.color}`}>
                                            <span>{phase.icon}</span>
                                            {phase.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <Users className="w-4 h-4"/>
                                        <span>
                                            {game.state !== GAME_STATES.WAITING
                                                ? `${alivePlayers.length} / ${maxPlayers} vivants`
                                                : `${players.length} / ${maxPlayers} joueurs`
                                            }
                                        </span>
                                    </div>

                                    {game.createdAt && game.state === GAME_STATES.WAITING && (
                                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4"/>
                                            <span>Créée le {formatDate(game.createdAt)}</span>
                                        </div>
                                    )}

                                    {game.startedAt && game.state === GAME_STATES.FINISHED && (
                                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4"/>
                                            <span>Début: {formatDate(game.startedAt)}</span>
                                        </div>
                                    )}

                                    {game.endedAt && game.state === GAME_STATES.FINISHED && (
                                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4"/>
                                            <span>Fin: {formatDate(game.endedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start sm:items-center lg:items-end gap-4">
                        {game.state === GAME_STATES.WAITING && (
                            <button
                                onClick={copyUrl}
                                className="group flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[120px] hover:cursor-pointer"
                                aria-label={copied ? "URL copiée" : "Copier le lien de la partie"}
                            >
                                <div className={`p-1.5 rounded-md ${copied
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30'
                                }`}>
                                    {copied ? (
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                    ) : (
                                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {copied ? 'Copié !' : 'Partager'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {copied ? 'Lien copié' : 'Copier le lien'}
                                    </div>
                                </div>
                            </button>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                                    <Crown className="w-3 h-3"/>
                                    <span>Créateur</span>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                                    {creator?.nickname || 'Anonyme'}
                                </div>
                            </div>

                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                                    <Image
                                        src={creator?.avatar || "/default-avatar.png"}
                                        alt={creator?.nickname ? `Avatar de ${creator.nickname}` : "Avatar du créateur"}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div
                                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="flex lg:hidden items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={copyUrl}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                        <Share2 className="w-4 h-4"/>
                        Partager
                    </button>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: <code
                        className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{game.id?.slice(0, 8)}...</code>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameHeader;