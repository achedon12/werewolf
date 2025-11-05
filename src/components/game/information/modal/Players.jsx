import {useEffect, useState} from 'react';
import Image from 'next/image';
import {formatDateTime} from "@/utils/Date";
import {Bot, Plus} from "lucide-react";
import { faker } from '@faker-js/faker';

const PlayersConfigurationModal = ({ game, currentPlayer, players, show, close = () => {}, excludePlayer = () => {}, addBot = () => {} }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [actionType, setActionType] = useState(''); // 'kick' or 'ban'
    const [duration, setDuration] = useState(''); // For ban duration
    const [reason, setReason] = useState('');
    const [configuration, setConfiguration] = useState(null);
    const [maxPlayers, setMaxPlayers] = useState(0);

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
    };

    const handleAddBot = () => {
        addBot(faker.person.firstName());
    }

    return (
        <div className="modal modal-open z-[100]">
            <div
                className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-lg"
                onClick={close}
            />

            <div className="modal-box max-w-none w-full h-screen rounded-none bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 relative overflow-hidden">

                <div className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-lg border-b border-white/10 p-6">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                👥 Gestion des Joueurs
                            </h2>
                            <p className="text-gray-300 mt-2">
                                {players.length} joueur{players.length > 1 ? 's' : ''} connecté{players.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Statut</p>
                                <p className="text-green-400 font-bold">
                                    {players.filter(p => p.online).length} en ligne
                                </p>
                            </div>
                            <button
                                className="btn btn-circle btn-ghost hover:bg-red-500/20 hover:text-red-400 transition-all"
                                onClick={close}
                            >
                                <span className="text-2xl">✕</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-120px)] overflow-y-auto">

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Total</div>
                            <div className="stat-value text-primary text-2xl">{players.length}</div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">En ligne</div>
                            <div className="stat-value text-green-400 text-2xl">
                                {players.filter(p => p.online).length}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Hors ligne</div>
                            <div className="stat-value text-gray-400 text-2xl">
                                {players.filter(p => !p.online).length}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Admins</div>
                            <div className="stat-value text-yellow-400 text-2xl">
                                {players.filter(p => p.isAdmin).length + 1 /* +1 for owner */}
                            </div>
                        </div>
                        <div className="stat bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="stat-title text-gray-300">Bots</div>
                            <div className="stat-value text-purple-400 text-2xl">
                                {players.filter(p => p.isBot).length}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="group relative p-6 bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                            >
                                {player.isBot && (
                                    <div className="absolute -top-2 -left-2 z-10">
                                        <div className="badge badge-sm badge-purple">
                                            <Bot className="inline-block mr-1" size={12} />
                                            Bot
                                        </div>
                                    </div>
                                )}

                                {!player.isBot && (
                                    <div className="absolute -top-2 -right-2 z-10">
                                        <div className={`badge badge-sm ${
                                            (player.isAdmin || game.admin.id === player.id ) ? 'badge-warning' :
                                                player.online ? 'badge-success' : 'badge-error'
                                        }`}>
                                            {(player.isAdmin || game.admin.id === player.id ) ? '👑 Admin' :
                                                player.online ? '🟢 En ligne' : '🔴 Hors ligne'}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Image
                                                src={player.isBot ? '/bot-avatar.png' : player.avatar || "/default-avatar.png"}
                                                alt={player.nickname}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-base-200 ${
                                            player.online ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-lg truncate">
                                            {player.nickname}
                                            {(player.isAdmin || game.admin.id === player.id ) && <span className="text-yellow-400 ml-2">👑</span>}
                                        </h3>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Rejoint le {formatDateTime(player.joinedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 relative">
                                    {player.isBot && (
                                        <button
                                            onClick={() => handleKickPlayer(player.id, 'Suppression du bot')}
                                            className="btn btn-sm btn-outline btn-warning hover:cursor-pointer"
                                            title="Supprimer le bot"
                                        >
                                            🤖 Supprimer
                                        </button>
                                    )}
                                    {(!player.isAdmin || game.admin.id === currentPlayer.id) && !player.isBot && player.id !== currentPlayer.id && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedPlayer(player);
                                                    setActionType('kick');
                                                }}
                                                className="btn btn-sm btn-outline btn-error hover:cursor-pointer"
                                                title="Exclure le joueur"
                                            >
                                                🚪 Exclure
                                            </button>
                                        </>
                                    )}

                                </div>

                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                        {players.length < maxPlayers && (
                            <div
                                className="flex flex-col items-center justify-center p-6 bg-base-200/20 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                                title={`Ajouter un bot (${maxPlayers - players.length} place${maxPlayers - players.length > 1 ? 's' : ''} restante${maxPlayers - players.length > 1 ? 's' : ''})`}
                                onClick={handleAddBot}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                                    <Plus className="text-white" size={32} />
                                </div>
                                <h3 className="font-bold text-white text-lg">Ajouter un bot</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {maxPlayers - players.length} place{maxPlayers - players.length > 1 ? 's' : ''} restante{maxPlayers - players.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        )}
                    </div>

                    {players.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-base-200/30 flex items-center justify-center">
                                <span className="text-6xl">👤</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Aucun joueur</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Aucun joueur n&apos;est actuellement dans la partie.
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-base-200/80 backdrop-blur-lg border-t border-white/10 p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-gray-400 text-sm">
                            ⚠️ Les actions sont irréversibles
                        </div>
                        <button
                            className="btn btn-primary btn-lg px-8"
                            onClick={close}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>

            {selectedPlayer && (
                <div className="modal modal-open z-[110]">
                    <div className="modal-backdrop" onClick={() => setSelectedPlayer(null)} />
                    <div className="modal-box max-w-md bg-base-200/95 backdrop-blur-lg border border-white/10">
                        <h3 className="font-bold text-lg text-white mb-4">
                            {actionType === 'kick' ? '🚪 Exclure le joueur' : '⚔️ Bannir le joueur'}
                        </h3>

                        <div className="flex items-center space-x-3 mb-6 p-3 bg-base-300/30 rounded-lg">
                            <Image
                                src={selectedPlayer.isBot ? '/bot-avatar.png' : selectedPlayer.avatar || "/default-avatar.png"}
                                alt={selectedPlayer.nickname}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-white">{selectedPlayer.nickname}</p>
                            </div>
                        </div>

                        {actionType === 'ban' && (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text text-white">Durée du bannissement</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="">Sélectionner une durée</option>
                                    <option value="1h">1 heure</option>
                                    <option value="24h">24 heures</option>
                                    <option value="7d">7 jours</option>
                                    <option value="30d">30 jours</option>
                                    <option value="permanent">Permanent</option>
                                </select>
                            </div>
                        )}

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text text-white">
                                    Raison {actionType === 'kick' ? 'de l\'exclusion' : 'du bannissement'}
                                </span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-20"
                                placeholder="Expliquez la raison de cette action..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setSelectedPlayer(null)}
                            >
                                Annuler
                            </button>
                            <button
                                className={`btn ${actionType === 'kick' ? 'btn-warning' : 'btn-error'}`}
                                onClick={() => {
                                    if (actionType === 'kick') {
                                        handleKickPlayer(selectedPlayer.id, reason);
                                    }
                                }}
                                disabled={!reason.trim() || (actionType === 'ban' && !duration)}
                            >
                                {actionType === 'kick' ? '🚪 Exclure' : '⚔️ Bannir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayersConfigurationModal;