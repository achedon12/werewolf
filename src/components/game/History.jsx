import { History } from 'lucide-react';
import {ACTION_TYPES, GAME_STATES} from "@/server/config/constants.js";
import {formatTimeDifference} from "@/utils/Date.js";
const GameHistory = ({ history, game }) => {

    if (game.state !== GAME_STATES.IN_PROGRESS && game.state !== GAME_STATES.FINISHED) {
        return null;
    }

    return (
        <div className="card bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="card-body p-2 md:p-4">
                <h3 className="card-title text-gray-900 dark:text-white text-lg mb-4">
                    <History className="inline mr-2" size={20}/>
                    Derniers Événements
                </h3>
                <div className="space-y-3 max-h-128 overflow-y-auto">
                    {history
                        .filter(event => event.type === ACTION_TYPES.GAME_EVENT)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((event, index) => {
                            const startedAtMs = new Date(game.startedAt);
                            const eventAtMs = new Date(event.createdAt);
                            const elapsed = formatTimeDifference(startedAtMs, eventAtMs);

                            return (
                                <div key={index}
                                     className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs mt-1">{elapsed}</span>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">{event.message}</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    )
}

export default GameHistory;