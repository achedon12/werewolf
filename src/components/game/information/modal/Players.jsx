import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDateTime} from "@/utils/Date";
import {Bot, Plus, Crown, User, Wifi, WifiOff, AlertTriangle, X, Shield, Clock, Users} from "lucide-react";
import { faker } from '@faker-js/faker';
import {BOT_TYPES} from "@/utils/Bot.js";

const PlayersConfigurationModal = ({ game, currentPlayer, players, show, close = () => {}, excludePlayer = () => {}, addBot = () => {} }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [actionType, setActionType] = useState('');
    const [duration, setDuration] = useState('');
    const [reason, setReason] = useState('');
    const [configuration, setConfiguration] = useState(null);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'online', 'offline', 'bots', 'admins'

    useEffect(() => {
        if (!game) return;
        setConfiguration(JSON.parse(game.configuration));
    }, [game]);

    useEffect(() => {
        if (!configuration) return;
        setMaxPlayers(Object.values(configuration).reduce((a, b) => a + b, 0))
    }, [configuration]);

    if (!show) return null;

    const handleKickPlayer = (playerId, reason) => {
        excludePlayer(playerId, reason);
        setSelectedPlayer(null);
        setReason('');
    };

    const handleAddBot = () => {
        addBot(faker.person.firstName(), BOT_TYPES.BASIC);
    }

    // Filtrage des joueurs
    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.nickname.toLowerCase().includes(searchTerm.toLowerCase());

        switch (filter) {
            case 'online':
                return matchesSearch && player.online && !player.isBot;
            case 'offline':
                return matchesSearch && !player.online && !player.isBot;
            case 'bots':
                return matchesSearch && player.isBot;
            case 'admins':
                return matchesSearch && (player.isAdmin || game.admin.id === player.id);
            default:
                return matchesSearch;
        }
    });

    const canManagePlayer = (player) => {
        if (game.admin.id === player.id) return false;
        if (game.admin.id === currentPlayer?.id) return true;

        if (currentPlayer?.isAdmin) {
            return !player.isAdmin && game.admin.id !== player.id && !player.isBot;
        }

        return false;
    };

    return (
        <div className="modal modal-open z-[100]">
            <div
                className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={close}
            />

            <div className="modal-box max-w-none w-full h-screen rounded-none bg-white dark:bg-gray-900 p-0 relative overflow-hidden">

                <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                Gestion des Joueurs
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {players.length} joueur{players.length > 1 ? 's' : ''} dans la partie
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">En ligne</p>
                                    <p className="text-green-600 dark:text-green-400 font-bold text-lg">
                                        {players.filter(p => p.online).length}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                            </div>
                            <button
                                className="btn btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={close}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-2 md:p-4 max-w-7xl mx-auto h-[calc(100vh-140px)] overflow-y-auto">

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
                        <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total</div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{players.length}</div>
                        </div>
                        <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                <Wifi className="w-4 h-4" />
                                En ligne
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                                {players.filter(p => p.online).length}
                            </div>
                        </div>
                        <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                <WifiOff className="w-4 h-4" />
                                Hors ligne
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400">
                                {players.filter(p => !p.online).length}
                            </div>
                        </div>
                        <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                <Crown className="w-4 h-4" />
                                Admins
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {players.filter(p => p.isAdmin || game.admin.id === p.id).length}
                            </div>
                        </div>
                        <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                <Bot className="w-4 h-4" />
                                Bots
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {players.filter(p => p.isBot).length}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un joueur..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => setFilter('online')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${filter === 'online' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                <Wifi className="w-4 h-4" />
                                En ligne
                            </button>
                            <button
                                onClick={() => setFilter('bots')}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${filter === 'bots' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                <Bot className="w-4 h-4" />
                                Bots
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredPlayers.map((player) => (
                            <div
                                key={player.id}
                                className="group relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-md"
                            >
                                <div className="absolute -top-2 -right-2 z-10 flex gap-1">
                                    {player.isBot && (
                                        <span className="badge badge-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-0">
                                            <Bot className="w-3 h-3 mr-1" />
                                            Bot
                                        </span>
                                    )}
                                    {(player.isAdmin || game.admin.id === player.id) && !player.isBot && (
                                        <span className="badge badge-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-0">
                                            <Crown className="w-3 h-3 mr-1" />
                                            Admin
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                                            player.online
                                                ? 'border-green-500 dark:border-green-400'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                            <Image
                                                src={player.isBot ? '/bot-avatar.png' : player.avatar ? player.avatar : "/default-avatar.png"}
                                                alt={player.nickname}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                            player.online ? 'bg-green-500' : 'bg-gray-400'
                                        }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {player.nickname}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDateTime(player.joinedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {player.online ? 'En ligne' : 'Hors ligne'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {player.isBot && (
                                        <button
                                            onClick={() => {
                                                setSelectedPlayer(player);
                                                setActionType('kick');
                                            }}
                                            className="flex-1 btn btn-sm btn-outline btn-error"
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Supprimer
                                        </button>
                                    )}
                                    {!player.isBot && canManagePlayer(player) && (
                                        <button
                                            onClick={() => {
                                                setSelectedPlayer(player);
                                                setActionType('kick');
                                            }}
                                            className="flex-1 btn btn-sm btn-outline btn-warning"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Exclure
                                        </button>
                                    )}
                                    {!player.isBot && !canManagePlayer(player) && player.id !== currentPlayer?.id && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            Actions non autorisées
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {players.length < maxPlayers && (
                            <button
                                onClick={handleAddBot}
                                className="group flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:cursor-pointer"
                            >
                                <div className="w-16 h-16 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                    <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Ajouter un bot
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {maxPlayers - players.length} place{maxPlayers - players.length > 1 ? 's' : ''} restante{maxPlayers - players.length > 1 ? 's' : ''}
                                </p>
                            </button>
                        )}
                    </div>

                    {filteredPlayers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucun joueur trouvé
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                {searchTerm
                                    ? `Aucun joueur ne correspond à "${searchTerm}"`
                                    : "Aucun joueur ne correspond aux filtres sélectionnés"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4" />
                            <span>Seuls les administrateurs peuvent exclure des joueurs</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="btn btn-ghost"
                                onClick={close}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={close}
                            >
                                Terminer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedPlayer && (
                <div className="modal modal-open z-[110]">
                    <div className="modal-backdrop" onClick={() => {
                        setSelectedPlayer(null);
                        setReason('');
                        setDuration('');
                    }} />
                    <div className="modal-box max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    Exclure le joueur
                                </h3>
                            </div>
                            <button
                                className="btn btn-circle btn-ghost btn-sm"
                                onClick={() => {
                                    setSelectedPlayer(null);
                                    setReason('');
                                }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500">
                                    <Image
                                        src={selectedPlayer.isBot ? '/bot-avatar.png' : selectedPlayer.avatar ? selectedPlayer.avatar : "/default-avatar.png"}
                                        alt={selectedPlayer.nickname}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{selectedPlayer.nickname}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedPlayer.isBot ? 'Bot' : 'Joueur'}
                                </p>
                            </div>
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text text-gray-700 dark:text-gray-300">
                                    Raison de l'exclusion
                                </span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                                placeholder="Expliquez la raison de cette exclusion..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <div className="label">
                                <span className="label-text-alt text-gray-500 dark:text-gray-400">
                                    Cette raison sera visible par le joueur
                                </span>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setSelectedPlayer(null);
                                    setReason('');
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={() => {
                                    handleKickPlayer(selectedPlayer.id, reason || 'Aucune raison spécifiée');
                                }}
                                disabled={!reason.trim()}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Confirmer l'exclusion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayersConfigurationModal;