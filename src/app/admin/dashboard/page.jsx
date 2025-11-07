'use client';
import {useEffect, useState} from 'react';
import {AlertTriangle, CheckCircle2, Clock, Eye, Gamepad2, TrendingUp, Users, XCircle} from 'lucide-react';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wsHealth, setWsHealth] = useState({status: 'unknown', latencyMs: null});
    const [apiHealth, setApiHealth] = useState({status: 'unknown'});
    const [dbHealth, setDbHealth] = useState({status: 'unknown'});

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            try {
                const sDataRes = await fetch('/api/admin/stats', {headers: {Authorization: `Bearer ${token}`}})
                const sData = await sDataRes.json();

                if (sData && sData.stats) {
                    setStats(sData.stats);
                    setRecentActivity(sData.recentActivity || []);
                }

                // websocket health
                const hDataRes = await fetch('/api/health/websocket', {headers: {Authorization: `Bearer ${token}`}})
                const hData = await hDataRes.json();

                if (hData && hData.websocket) {
                    setWsHealth({
                        status: hData.websocket.status || 'down',
                        latencyMs: hData.websocket.latencyMs ?? null
                    });
                } else {
                    setWsHealth(prev => ({...prev, status: 'down'}));
                }

                // api health
                const now = Date.now();
                const apiRes = await fetch('/api/infos');
                const apiData = await apiRes.json();

                if (apiData && apiRes.ok) {
                    const latency = Date.now() - now;
                    setApiHealth({status: 'ok', latencyMs: latency});
                } else {
                    setApiHealth({status: 'down'});
                }

                // database health
                const dbRes = await fetch('/api/health/database', {headers: {Authorization: `Bearer ${token}`}})
                const dbData = await dbRes.json();

                if (dbData && dbData.db) {
                    setDbHealth({
                        status: dbData.db.status || 'down',
                        latencyMs: (dbData.db.connectMs || 0) + (dbData.db.queryMs || 0)
                    });
                } else {
                    setDbHealth({status: 'down'});
                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({title, value, icon: Icon, trend = null, color = 'blue'}) => (
        <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="card-body p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                        {trend !== null && trend !== undefined && (
                            <p className={`text-sm mt-1 ${
                                trend > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mois dernier
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
                        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}/>
                    </div>
                </div>
            </div>
        </div>
    );

    const StatusIndicator = ({status}) => {
        const config = {
            success: {color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2},
            warning: {color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle},
            error: {color: 'text-red-600', bg: 'bg-red-100', icon: XCircle},
        };
        const {color, bg, icon: StatusIcon} = status === 'ok' ? config.success : config.error;
        return (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                <StatusIcon className="h-3 w-3"/>
                {status === 'ok' ? 'Opérationnel' : 'Indisponible'}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Tableau de bord administrateur
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Aperçu général de la plateforme et des statistiques
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-primary">
                        <Eye className="h-4 w-4"/>
                        Vue d'ensemble
                    </button>
                    <button className="btn btn-outline" onClick={() => location.reload()}>
                        <Clock className="h-4 w-4"/>
                        Actualiser
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs totaux"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend={stats.totalUsersTrend}
                    color="blue"
                />
                <StatCard
                    title="Parties en cours"
                    value={stats.activeGames}
                    icon={Gamepad2}
                    color="green"
                />
                <StatCard
                    title="Joueurs en ligne"
                    value={stats.onlinePlayers}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Santé du système"
                    value={`${stats.systemHealth}%`}
                    icon={CheckCircle2}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="card-body p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{stats.gamesToday}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Parties aujourd'hui</p>
                        </div>
                    </div>
                    <div
                        className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="card-body p-4 text-center">
                            <p className="text-2xl font-bold text-secondary">{stats.newRegistrations}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nouvelles inscriptions</p>
                        </div>
                    </div>
                    <div
                        className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="card-body p-4 text-center">
                            <p className="text-2xl font-bold text-accent">{stats.reports}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Signalements</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Santé du système</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Serveur API</span>
                                    <span className={apiHealth.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                                        {apiHealth.status === 'ok' ? `Opérationnel${apiHealth.latencyMs ? ` · ${apiHealth.latencyMs}ms` : ''}` : 'Indisponible'}
                                    </span>
                                </div>
                                <progress
                                    className={`progress ${apiHealth.status === 'ok' ? 'progress-success' : 'progress-error'} w-full`}
                                    value={stats.systemHealth}
                                    max="100"></progress>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Base de données</span>
                                    <span className={dbHealth.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                                        {dbHealth.status === 'ok' ? `Opérationnel${dbHealth.latencyMs ? ` · ${dbHealth.latencyMs}ms` : ''}` : 'Indisponible'}
                                    </span>
                                </div>
                                <progress
                                    className={`progress ${dbHealth.status === 'ok' ? 'progress-success' : 'progress-error'} w-full`}
                                    value={stats.systemHealth}
                                    max="100"></progress>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>WebSocket</span>
                                    <span className={wsHealth.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                                        {wsHealth.status === 'ok' ? `Opérationnel${wsHealth.latencyMs ? ` · ${wsHealth.latencyMs}ms` : ''}` : 'Indisponible'}
                                    </span>
                                </div>
                                <progress
                                    className={`progress ${wsHealth.status === 'ok' ? 'progress-success' : 'progress-error'} w-full`}
                                    value={wsHealth.status === 'ok' ? 100 : 0}
                                    max="100"
                                ></progress>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Activité récente</h3>
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id}
                                     className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                            activity.status === 'success' ? 'bg-green-500' :
                                                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {activity.action}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                par {activity.user} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusIndicator status={activity.status}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Alertes et actions</h3>
                        <div className="space-y-4">
                            <div className="alert alert-warning">
                                <AlertTriangle className="h-4 w-4"/>
                                <span>3 signalements en attente de modération</span>
                            </div>
                            <div className="alert alert-info">
                                <Users className="h-4 w-4"/>
                                <span>42 nouvelles inscriptions ce mois-ci</span>
                            </div>
                            <div className="alert alert-success">
                                <CheckCircle2 className="h-4 w-4"/>
                                <span>Tous les systèmes sont opérationnels</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="btn btn-primary btn-sm flex-1">
                                    Voir les signalements
                                </button>
                                <button className="btn btn-outline btn-sm flex-1">
                                    Exporter les données
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;