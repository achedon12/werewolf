'use client';
import {useEffect, useState} from 'react';
import {CheckCircle, Crown, Edit, MoreVertical, Search, Shield, ShieldOff, Trash2, User, XCircle} from 'lucide-react';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
        return () => clearTimeout(id);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('pageSize', String(pageSize));
                if (debouncedSearch) params.set('search', debouncedSearch);

                const res = await fetch(`/api/admin/user/list?${params.toString()}`, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const data = await res.json();
                setUsers(Array.isArray(data.users) ? data.users : []);
                setTotal(typeof data.total === 'number' ? data.total : 0);
                setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
            } catch (error) {
                console.error(error);
                setUsers([]);
                setTotal(0);
                setTotalPages(1);
            }
            setLoading(false);
        };

        fetchUsers();
    }, [page, pageSize, debouncedSearch]);

    useEffect(() => {
        let result = users;

        if (statusFilter !== 'all') {
            result = result.filter(user =>
                statusFilter === 'verified' ? user.verified : !user.verified
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [users, statusFilter, roleFilter]);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleToggleAdmin = async (user) => {
        try {
            console.log('Toggle admin for:', user.id);
            setUsers(users.map(u =>
                u.id === user.id ? {...u, role: u.role === 'admin' ? 'user' : 'admin'} : u
            ));
        } catch (error) {
            console.error('Erreur lors du changement de rôle:', error);
        }
    };

    const handleToggleVerification = async (user) => {
        try {
            console.log('Toggle verification for:', user.id);
            setUsers(users.map(u =>
                u.id === user.id ? {...u, verified: !u.verified} : u
            ));
        } catch (error) {
            console.error('Erreur lors du changement de vérification:', error);
        }
    };

    const calculateWinRate = (user) => {
        return user.gamesPlayed > 0 ? ((user.victories / user.gamesPlayed) * 100).toFixed(1) : 0;
    };

    const UserRow = ({user}) => (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <img src={user?.avatar ? user.avatar : '/default-avatar.png'} alt={user.name}
                                 className="rounded-full object-cover w-full h-full"/>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                                {user.name || 'Sans nom'}
                            </p>
                            {user.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500"/>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            @{user.nickname}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[180px]">
                            {user.email}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                    <div
                        className={`badge badge-sm flex items-center gap-2 px-2 py-1 text-xs sm:text-sm ${user.verified ? 'badge-success' : 'badge-warning'}`}
                        aria-label={user.verified ? 'Vérifié' : 'Non vérifié'}
                    >
                        {user.verified ? <CheckCircle className="h-4 w-4"/> : <XCircle className="h-4 w-4"/>}
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">
                            {user.verified ? 'Vérifié' : 'Non vérifié'}
                        </span>
                    </div>
                    <div className={`badge badge-sm badge-outline ${user.role === 'admin' ? 'badge-primary' : ''}`}>
                        {user.role}
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col text-sm">
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Parties:</span>
                        <span className="font-medium">{user.gamesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Victoires:</span>
                        <span className="font-medium text-green-600">{user.victories || 0}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Win Rate:</span>
                        <span className="font-medium text-blue-600">{calculateWinRate(user)}%</span>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col md:flex-row gap-1">
                    {user.ambientSoundsEnabled && (
                        <div className="tooltip" data-tip="Sons activés">
                            <div className="badge badge-sm badge-outline">🎵</div>
                        </div>
                    )}
                    {user.ambientThemeEnabled && (
                        <div className="tooltip" data-tip="Thème activé">
                            <div className="badge badge-sm badge-outline">🎨</div>
                        </div>
                    )}
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                        <MoreVertical className="h-4 w-4"/>
                    </div>
                    <ul tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <button onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4"/> Modifier
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleToggleAdmin(user)}>
                                {user.role === 'admin' ? <ShieldOff className="h-4 w-4"/> :
                                    <Shield className="h-4 w-4"/>}
                                {user.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleToggleVerification(user)}>
                                {user.verified ? <XCircle className="h-4 w-4"/> :
                                    <CheckCircle className="h-4 w-4"/>}
                                {user.verified ? 'Dévérifier' : 'Vérifier'}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleDeleteUser(user)} className="text-error hover:text-error">
                                <Trash2 className="h-4 w-4"/> Supprimer
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
                    <p className="text-gray-600 dark:text-gray-400">Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{total} utilisateur(s) trouvé(s)</p>
                </div>
                <button className="btn btn-primary">
                    <User className="h-4 w-4"/> Exporter les données
                </button>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-3">
                            <label className="input input-bordered flex items-center gap-2">
                                <Search className="h-4 w-4"/>
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Rechercher par email, nom ou pseudo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </label>
                        </div>

                        <select className="select select-bordered" value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Tous les statuts</option>
                            <option value="verified">Vérifiés</option>
                            <option value="unverified">Non vérifiés</option>
                        </select>

                        <select className="select select-bordered" value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="all">Tous les rôles</option>
                            <option value="admin">Administrateurs</option>
                            <option value="user">Utilisateurs</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Utilisateur</th>
                                <th className="px-4 py-3 font-semibold">Statut</th>
                                <th className="px-4 py-3 font-semibold">Statistiques</th>
                                <th className="px-4 py-3 font-semibold">Préférences</th>
                                <th className="px-4 py-3 font-semibold">Inscription</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user) => (
                                <UserRow key={user.id} user={user}/>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <User className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Aucun utilisateur trouvé
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Aucun utilisateur ne correspond à vos critères de recherche.
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

            {showEditModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Modifier l'utilisateur</h3>
                        <p className="py-4">Modal d'édition pour {selectedUser?.name}</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowEditModal(false)}>Annuler</button>
                            <button className="btn btn-primary">Sauvegarder</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Supprimer l'utilisateur</h3>
                        <p className="py-4">
                            Êtes-vous sûr de vouloir supprimer {selectedUser?.name} ? Cette action est irréversible.
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

export default AdminUsersPage;