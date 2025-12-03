'use client';
import {useEffect, useState} from 'react';
import {
    BarChart3,
    CheckCircle,
    Clock,
    Eye,
    Gamepad2,
    Lock,
    MoreVertical,
    Pause,
    Play,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import {GAME_PHASES, GAME_STATES} from "@/server/config/constants.js";
import {useIsMobile} from "@/utils/Screen.js";

const AdminGamesPage = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedGame, setSelectedGame] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({waiting: 0, inProgress: 0, finished: 0});
    const isMobile = useIsMobile();


    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('pageSize', String(pageSize));
                if (debouncedSearch) params.set('search', debouncedSearch);

                const res = await fetch(`/api/admin/game/list?${params.toString()}`, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const data = await res.json();
                setGames(data.games);
                setStats(data.stats || {waiting: 0, inProgress: 0, finished: 0});
                setFilteredGames(data.games);
                setTotal(typeof data.total === 'number' ? data.total : 0);
                setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
            } catch (error) {
                console.error('Erreur lors du chargement des parties:', error);
            }
            setLoading(false);
        };

        fetchGames();
    }, [page, pageSize, debouncedSearch]);

    useEffect(() => {
        let result = games;

        if (searchTerm) {
            result = result.filter(game =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(game => game.status === statusFilter);
        }

        setFilteredGames(result);
    }, [games, searchTerm, statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            [GAME_STATES.WAITING]: {color: 'badge-warning', text: 'En attente', icon: Clock},
            [GAME_STATES.IN_PROGRESS]: {color: 'badge-success', text: 'En cours', icon: Play},
            [GAME_STATES.FINISHED]: {color: 'badge-info', text: 'Terminée', icon: CheckCircle},
        };

        const config = statusConfig[status] || statusConfig[GAME_STATES.WAITING];
        const IconComponent = config.icon;

        if (isMobile) {
            return (
                <div
                    className={`badge badge-sm gap-1 ${config.color} px-2 py-1`}
                    aria-label={config.text}
                    title={config.text}
                >
                    <IconComponent className="h-3 w-3" />
                    <span className="text-xs truncate max-w-[80px]">{config.text}</span>
                </div>
            );
        }

        return (
            <div className={`badge badge-sm gap-1 ${config.color}`}>
                <IconComponent className="h-3 w-3"/>
                {config.text}
            </div>
        );
    };

    const getPhaseBadge = (phase) => {
        const phaseConfig = {
            [GAME_PHASES.NIGHT]: {color: 'badge-neutral', text: '🌙 Nuit'},
            [GAME_PHASES.DAY]: {color: 'badge-warning', text: '☀️ Jour'},
            [GAME_PHASES.VOTE]: {color: 'badge-primary', text: '🗳️ Vote'},
            [GAME_PHASES.ENDED]: {color: 'badge-info', text: '🏁 Terminé'}
        };

        const config = phaseConfig[phase] || {color: 'badge-ghost', text: 'Non commencé'};

        return <div className={`badge badge-sm ${config.color}`}>{config.text}</div>;
    };

    const handleViewDetails = (game) => {
        setSelectedGame(game);
        setShowDetailsModal(true);
    };

    const handleDeleteGame = (game) => {
        setSelectedGame(game);
        setShowDeleteModal(true);
    };

    const handleForceAction = async (game, action) => {
        try {
            console.log(`${action} pour la partie:`, game.id);
        } catch (error) {
            console.error('Erreur lors de l\'action:', error);
        }
    };

    const calculateDuration = (game) => {
        if (!game.startedAt) return null;

        const start = new Date(game.startedAt);
        const end = game.finishedAt ? new Date(game.finishedAt) : new Date();
        const duration = Math.floor((end - start) / 60000);

        return `${duration} min`;
    };

    const GameRow = ({game}) => (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="h-4 w-4 text-white"/>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                                {game.name}
                            </p>
                            {game.settings.private && (
                                <div className="tooltip" data-tip="Partie privée">
                                    <Lock className="h-3 w-3 text-gray-400"/>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            Code: {game.id}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[140px]">
                            Par {game.creator.name}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                    {getStatusBadge(game.status)}
                    {game.phase && getPhaseBadge(game.phase)}
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col text-sm">
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Joueurs:</span>
                        <span className="font-medium">
                            {game.currentPlayers}/{game.maxPlayers}
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">En vie:</span>
                        <span className="font-medium text-green-600">
                            {game.players.filter(p => p.alive).length}
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col text-sm">
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Rôles:</span>
                        <span className="font-medium">{game.settings.roles.length}</span>
                    </div>
                    {game.startedAt && (
                        <div className="flex justify-between gap-2">
                            <span className="text-gray-500">Durée:</span>
                            <span className="font-medium text-blue-600">{calculateDuration(game)}</span>
                        </div>
                    )}
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                    {game.players.slice(0, 4).map((player, index) => (
                        <div
                            key={player.id}
                            className={`badge badge-xs ${
                                player.alive === false ? 'badge-error' :
                                    player.role ? 'badge-primary' : 'badge-outline'
                            }`}
                            title={`${player.name} - ${player.role || 'Non assigné'}`}
                        >
                            {player.role ? player.role.substring(0, 2) : '??'}
                        </div>
                    ))}
                    {game.players.length > 4 && (
                        <div className="badge badge-ghost badge-xs"
                             title={`${game.players.length - 4} joueurs supplémentaires`}>
                            +{game.players.length - 4}
                        </div>
                    )}
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(game.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </div>
            </td>

            <td className="px-4 py-3">
                {game.winner ? (
                    <div className="badge badge-sm badge-success">
                        🏆 {game.winner}
                    </div>
                ) : (
                    <div className="text-xs text-gray-400">En cours</div>
                )}
            </td>

            <td className="px-4 py-3">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                        <MoreVertical className="h-4 w-4"/>
                    </div>
                    <ul tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <button onClick={() => handleViewDetails(game)}>
                                <Eye className="h-4 w-4"/>
                                Détails
                            </button>
                        </li>

                        {game.status === GAME_STATES.WAITING && (
                            <li>
                                <button onClick={() => handleForceAction(game, 'start')}>
                                    <Play className="h-4 w-4"/>
                                    Forcer le début
                                </button>
                            </li>
                        )}

                        {game.status === GAME_STATES.IN_PROGRESS && (
                            <>
                                <li>
                                    <button onClick={() => handleForceAction(game, 'pause')}>
                                        <Pause className="h-4 w-4"/>
                                        Pause
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleForceAction(game, 'end')}>
                                        <CheckCircle className="h-4 w-4"/>
                                        Forcer la fin
                                    </button>
                                </li>
                            </>
                        )}

                        <li>
                            <button
                                onClick={() => handleDeleteGame(game)}
                                className="text-error hover:text-error"
                            >
                                <Trash2 className="h-4 w-4"/>
                                Supprimer
                            </button>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement des parties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des parties</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{filteredGames.length} partie(s) trouvée(s)</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-outline">
                        <BarChart3 className="h-4 w-4"/>
                        Statistiques
                    </button>
                    <button className="btn btn-primary">
                        <Gamepad2 className="h-4 w-4"/>
                        Nouvelle partie
                    </button>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="input input-bordered flex items-center gap-2">
                                <Search className="h-4 w-4"/>
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Rechercher par nom, code ou créateur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </label>
                        </div>

                        <select
                            className="select select-bordered"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value={GAME_STATES.WAITING}>En attente</option>
                            <option value={GAME_STATES.IN_PROGRESS}>En cours</option>
                            <option value={GAME_STATES.FINISHED}>Terminées</option>
                        </select>

                        <select className="select select-bordered">
                            <option>Tous les types</option>
                            <option>Parties publiques</option>
                            <option>Parties privées</option>
                            <option>Avec spectateurs</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-primary">
                        <Clock className="h-8 w-8"/>
                    </div>
                    <div className="stat-title">En attente</div>
                    <div className="stat-value text-primary text-xl">
                        {stats.waiting}
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-success">
                        <Play className="h-8 w-8"/>
                    </div>
                    <div className="stat-title">En cours</div>
                    <div className="stat-value text-success text-xl">
                        {stats.inProgress}
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-info">
                        <CheckCircle className="h-8 w-8"/>
                    </div>
                    <div className="stat-title">Terminées</div>
                    <div className="stat-value text-info text-xl">
                        {stats.finished}
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-error">
                        <Users className="h-8 w-8"/>
                    </div>
                    <div className="stat-title">Joueurs</div>
                    <div className="stat-value text-error text-xl">
                        {games.reduce((acc, game) => acc + game.currentPlayers, 0)}
                    </div>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Partie</th>
                                <th className="px-4 py-3 font-semibold">Statut</th>
                                <th className="px-4 py-3 font-semibold">Joueurs</th>
                                <th className="px-4 py-3 font-semibold">Infos</th>
                                <th className="px-4 py-3 font-semibold">Rôles</th>
                                <th className="px-4 py-3 font-semibold">Création</th>
                                <th className="px-4 py-3 font-semibold">Vainqueur</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredGames.map((game) => (
                                <GameRow key={game.id} game={game}/>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredGames.length === 0 && (
                        <div className="text-center py-12">
                            <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune partie trouvée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Aucune partie ne correspond à vos critères de recherche.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >
                        Précédent
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page} sur {totalPages}
                    </span>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                    >
                        Suivant
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Afficher :</label>
                    <select
                        className="select select-bordered select-sm w-20"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {showDetailsModal && selectedGame && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl">
                        <h3 className="font-bold text-lg mb-4">Détails de la partie</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nom</label>
                                    <p className="font-semibold">{selectedGame.name}</p>
                                </div>
                                <div>
                                    <label className="label">Code</label>
                                    <p className="font-mono">{selectedGame.id}</p>
                                </div>
                            </div>

                            <div>
                                <label className="label">Joueurs ({selectedGame.players.length})</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedGame.players.map((player) => (
                                        <div key={player.id}
                                             className="flex items-center justify-between p-2 bg-base-200 rounded">
                                            <span>{player.isBot ? player.botName : player.name}</span>
                                            <div className="flex gap-2">
                                                {player.role && (
                                                    <span className="badge badge-primary">{player.role}</span>
                                                )}
                                                {player.alive !== null && (
                                                    <span
                                                        className={`badge ${player.alive ? 'badge-success' : 'badge-error'}`}>
                                                        {player.alive ? 'Vivant' : 'Mort'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDetailsModal(false)}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedGame && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Supprimer la partie</h3>
                        <p className="py-4">
                            Êtes-vous sûr de vouloir supprimer la partie "{selectedGame.name}" ?
                            Cette action est irréversible et supprimera toutes les données associées.
                        </p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                            <button className="btn btn-error">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGamesPage;