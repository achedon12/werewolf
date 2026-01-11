'use client';
import {useEffect, useState} from 'react';
import {AlertCircle, Eye, MoreVertical, Search, Trash2} from 'lucide-react';

const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
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
        const fetchReports = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('pageSize', String(pageSize));
                if (debouncedSearch) params.set('search', debouncedSearch);

                const res = await fetch(`/api/admin/reports?${params.toString()}`, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const data = await res.json();
                setReports(Array.isArray(data.reports) ? data.reports : []);
                setTotal(typeof data.total === 'number' ? data.total : 0);
                setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
            } catch (error) {
                console.error(error);
                setReports([]);
                setTotal(0);
                setTotalPages(1);
            }
            setLoading(false);
        };

        fetchReports();
    }, [page, pageSize, debouncedSearch]);

    useEffect(() => {
        setFilteredReports(reports);
    }, [reports]);

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setShowDetailsModal(true);
    };

    const handleDeleteReport = (report) => {
        setSelectedReport(report);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/user/report/${selectedReport.id}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (res.ok) {
                setReports(reports.filter(r => r.id !== selectedReport.id));
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const ReportRow = ({report}) => (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500"/>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                            {report.reason}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            ID: {report.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col gap-1 text-sm">
                    <div>
                        <span className="text-gray-500">Signaleur:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{report.reporter.email}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Pseudo:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">@{report.reporter.nickname || 'N/A'}</p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex flex-col gap-1 text-sm">
                    <div>
                        <span className="text-gray-500">Signalé:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{report.reported.email}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Pseudo:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">@{report.reported.nickname || 'N/A'}</p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
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
                            <button onClick={() => handleViewDetails(report)}>
                                <Eye className="h-4 w-4"/> Voir les détails
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleDeleteReport(report)} className="text-error hover:text-error">
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
                    <p className="text-gray-600 dark:text-gray-400">Chargement des signalements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des signalements</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{total} signalement(s) trouvé(s)</p>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-6">
                    <label className="input input-bordered flex items-center gap-2">
                        <Search className="h-4 w-4"/>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Rechercher par email, raison ou pseudo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Raison</th>
                                <th className="px-4 py-3 font-semibold">Signaleur</th>
                                <th className="px-4 py-3 font-semibold">Utilisateur signalé</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredReports.map((report) => (
                                <ReportRow key={report.id} report={report}/>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredReports.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Aucun signalement trouvé
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Aucun signalement ne correspond à vos critères de recherche.
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

            {showDetailsModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Détails du signalement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Raison</label>
                                <p className="text-gray-900 dark:text-white">{selectedReport?.reason}</p>
                            </div>
                            <div>
                                <label
                                    className="text-sm font-semibold text-gray-600 dark:text-gray-300">Détails</label>
                                <p className="text-gray-900 dark:text-white">{selectedReport?.details || 'Aucun détail fourni'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="text-sm font-semibold text-gray-600 dark:text-gray-300">Signaleur</label>
                                    <p className="text-gray-900 dark:text-white">{selectedReport?.reporter.email}</p>
                                    <p className="text-sm text-gray-500">@{selectedReport?.reporter.nickname}</p>
                                </div>
                                <div>
                                    <label
                                        className="text-sm font-semibold text-gray-600 dark:text-gray-300">Signalé</label>
                                    <p className="text-gray-900 dark:text-white">{selectedReport?.reported.email}</p>
                                    <p className="text-sm text-gray-500">@{selectedReport?.reported.nickname}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Date</label>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(selectedReport?.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDetailsModal(false)}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Supprimer le signalement</h3>
                        <p className="py-4">
                            Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.
                        </p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                            <button className="btn btn-error" onClick={handleConfirmDelete}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;