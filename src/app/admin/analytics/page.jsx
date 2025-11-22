'use client';
import {useEffect, useState} from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Clock, Download, Eye, Gamepad2, TrendingUp, Users,} from 'lucide-react';

const AdminAnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('7');
    const [loading, setLoading] = useState(true);
    const [activityByHour, setActivityByHour] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [popularRoles, setPopularRoles] = useState([]);
    const [overview, setOverview] = useState(null);
    const [gameStats, setGameStats] = useState([]);
    const [playerBehavior, setPlayerBehavior] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                // activity by hour
                const activityByOurRes = await fetch('/api/admin/analytics/activityByHour?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const activityByHourData = await activityByOurRes.json();
                setActivityByHour(activityByHourData.activityByHour);

                // user growth
                const userGrowthRes = await fetch('/api/admin/analytics/userGrowth?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const userGrowthData = await userGrowthRes.json();
                setUserGrowth(userGrowthData.userGrowth);

                // popular roles
                const popularRolesRes = await fetch('/api/admin/analytics/popularRoles?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const popularRolesData = await popularRolesRes.json();
                setPopularRoles(popularRolesData.popularRoles);

                // overview
                const overviewRes = await fetch('/api/admin/analytics/overview?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const overviewData = await overviewRes.json();
                setOverview(overviewData.overview);

                // game stats
                const gameStatsRes = await fetch('/api/admin/analytics/gameStats?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const gameStatsData = await gameStatsRes.json();
                setGameStats(gameStatsData.gameStats);

                // player behavior
                const playerBehaviorRes = await fetch('/api/admin/analytics/playerBehavior?timeRange=' + timeRange, {
                    headers: {'Authorization': `Bearer ${token}`},
                });
                const playerBehaviorData = await playerBehaviorRes.json();
                setPlayerBehavior(playerBehaviorData.playerBehavior);

            } catch (error) {
            }
            setLoading(false);
        };

        fetchAnalytics();
    }, [timeRange]);

    const StatCard = ({title, value, change, icon: Icon, color = 'blue'}) => (
        <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="card-body p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                        {change && (
                            <p className={`text-sm mt-1 ${
                                change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {change > 0 ? '↗' : '↘'} {Math.abs(change)}% vs période précédente
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

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{color: entry.color}}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement des analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Analytics & Statistiques
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Données et métriques de la plateforme en temps réel
                    </p>
                </div>

                <div className="flex gap-3">
                    <select
                        className="select select-bordered"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="2">24 dernières heures</option>
                        <option value="7">7 derniers jours</option>
                        <option value="30">30 derniers jours</option>
                        <option value="90">3 derniers mois</option>
                    </select>

                    <button className="btn btn-outline">
                        <Download className="h-4 w-4"/>
                        Exporter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs totaux"
                    value={overview.totalUsers.toLocaleString()}
                    change={overview.totalUsersChange}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Utilisateurs actifs"
                    value={overview.activeUsers}
                    change={overview.activeUsersChange}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Parties totales"
                    value={overview.totalGames.toLocaleString()}
                    change={overview.totalGamesChange}
                    icon={Gamepad2}
                    color="purple"
                />
                <StatCard
                    title="Taux de rétention"
                    value={`${overview.retentionRate}%`}
                    change={overview.totalGamesChange}
                    icon={Eye}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">📈 Croissance des utilisateurs</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    />
                                    <YAxis/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend/>
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name="Utilisateurs totaux"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="newUsers"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name="Nouveaux utilisateurs"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">🎮 Statut des parties</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gameStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({status, percentage}) => `${status}: ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {gameStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                index === 0 ? '#10b981' :
                                                    index === 1 ? '#3b82f6' : '#ef4444'
                                            }/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">🎭 Rôles les plus populaires</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularRoles}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
                                    <XAxis dataKey="role"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {popularRoles.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">🕒 Activité par heure de la journée</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityByHour}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
                                    <XAxis dataKey="hour"/>
                                    <YAxis/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend/>
                                    <Bar
                                        dataKey="games"
                                        fill="#8b5cf6"
                                        name="Parties"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="users"
                                        fill="#f59e0b"
                                        name="Joueurs"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">📊 Comportement des joueurs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {playerBehavior.map((item, index) => (
                            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-primary mb-1">
                                    {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                                    {item.metric.includes('Taux') && '%'}
                                    {item.metric.includes('Temps') && 'min'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.metric}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body text-center">
                        <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2"/>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {overview.avgSessionDuration}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Durée moyenne de session</p>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body text-center">
                        <Gamepad2 className="h-8 w-8 text-green-500 mx-auto mb-2"/>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Math.round(overview.totalGames / overview.totalUsers)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Parties par utilisateur</p>
                    </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="card-body text-center">
                        <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2"/>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            +{userGrowth[userGrowth.length - 1].newUsers}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Nouveaux utilisateurs (24h)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;