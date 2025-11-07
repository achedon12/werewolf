'use client';
import { useState, useEffect } from 'react';
import {
    Save,
    RefreshCw,
    Shield,
    Server,
    Mail,
    Bell,
    Globe,
    Gamepad2,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [testResults, setTestResults] = useState({});

    const defaultSettings = {
        general: {
            maintenanceMode: false,
            maxPlayersPerGame: 18,
            allowSpectators: true,
        },
        security: {
            requireEmailVerification: true,
            maxLoginAttempts: 5,
            sessionTimeout: 24,
            enable2FA: false,
            allowRegistration: true
        },
        notifications: {
            emailOnNewUser: true,
            emailOnGameReport: true,
            notifyAdminsOnMaintenance: true,
            discordWebhook: '',
            slackWebhook: ''
        },
        performance: {
            cacheEnabled: true,
            cacheDuration: 3600,
            compressionEnabled: true,
            rateLimiting: true,
            maxRequestsPerMinute: 60
        },
        features: {
            enableRanking: true,
            enableAchievements: true,
            enableChat: true,
            enableVoiceChat: false,
            customRoles: false,
            tournamentMode: false
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                // Simulation - à remplacer par ton API
                setTimeout(() => {
                    setSettings(defaultSettings);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres:', error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // À implémenter avec ton API
            console.log('Sauvegarde des paramètres:', settings);

            // Simulation de sauvegarde
            await new Promise(resolve => setTimeout(resolve, 2000));

            // En production: await fetch('/api/admin/settings', { method: 'POST', body: JSON.stringify(settings) });

        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
        setSaving(false);
    };

    const handleReset = () => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
            setSettings(defaultSettings);
        }
    };

    const handleTestConnection = async (type) => {
        setTestResults(prev => ({ ...prev, [type]: 'testing' }));

        try {
            // Simulation de test - à implémenter avec ton API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simuler un résultat aléatoire pour la démo
            const success = Math.random() > 0.3;
            setTestResults(prev => ({
                ...prev,
                [type]: success ? 'success' : 'error'
            }));

            setTimeout(() => {
                setTestResults(prev => ({ ...prev, [type]: null }));
            }, 5000);

        } catch (error) {
            setTestResults(prev => ({ ...prev, [type]: 'error' }));
        }
    };

    const handleInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const TestButton = ({ type, label }) => {
        const status = testResults[type];

        return (
            <button
                type="button"
                onClick={() => handleTestConnection(type)}
                disabled={status === 'testing'}
                className={`btn btn-sm ${
                    status === 'success' ? 'btn-success' :
                        status === 'error' ? 'btn-error' :
                            'btn-outline'
                }`}
            >
                {status === 'testing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                {status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                {status === 'error' && <XCircle className="h-3 w-3" />}
                {!status && 'Tester'}
                {label}
            </button>
        );
    };

    const TabContent = () => {
        if (!settings.general) return null;

        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Joueurs maximum par partie</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    min="4"
                                    max="30"
                                    value={settings.general.maxPlayersPerGame}
                                    onChange={(e) => handleInputChange('general', 'maxPlayersPerGame', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Mode maintenance</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.general.maintenanceMode}
                                        onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                                    />
                                </label>
                                <label className="label">
                                  <span className="label-text-alt text-warning">
                                    {settings.general.maintenanceMode
                                        ? '⚠️ Le site est en mode maintenance'
                                        : 'Le site est accessible aux utilisateurs'
                                    }
                                  </span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Autoriser les spectateurs</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.general.allowSpectators}
                                        onChange={(e) => handleInputChange('general', 'allowSpectators', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div className="alert alert-warning">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Les modifications de ces paramètres affectent la sécurité de la plateforme</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Vérification email requise</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.security.requireEmailVerification}
                                        onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Autoriser les inscriptions</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.security.allowRegistration}
                                        onChange={(e) => handleInputChange('security', 'allowRegistration', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Authentification à deux facteurs</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.security.enable2FA}
                                        onChange={(e) => handleInputChange('security', 'enable2FA', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Tentatives de connexion max</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    min="1"
                                    max="10"
                                    value={settings.security.maxLoginAttempts}
                                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Timeout session (heures)</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    min="1"
                                    max="720"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Email pour nouveaux utilisateurs</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.notifications.emailOnNewUser}
                                        onChange={(e) => handleInputChange('notifications', 'emailOnNewUser', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Email pour signalements</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.notifications.emailOnGameReport}
                                        onChange={(e) => handleInputChange('notifications', 'emailOnGameReport', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Notifier les admins en maintenance</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.notifications.notifyAdminsOnMaintenance}
                                        onChange={(e) => handleInputChange('notifications', 'notifyAdminsOnMaintenance', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Webhook Discord</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                placeholder="https://discord.com/api/webhooks/..."
                                value={settings.notifications.discordWebhook}
                                onChange={(e) => handleInputChange('notifications', 'discordWebhook', e.target.value)}
                            />
                            <TestButton type="discord" label="Webhook Discord" />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Webhook Slack</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                placeholder="https://hooks.slack.com/services/..."
                                value={settings.notifications.slackWebhook}
                                onChange={(e) => handleInputChange('notifications', 'slackWebhook', e.target.value)}
                            />
                            <TestButton type="slack" label="Webhook Slack" />
                        </div>
                    </div>
                );

            case 'performance':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Cache activé</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.performance.cacheEnabled}
                                        onChange={(e) => handleInputChange('performance', 'cacheEnabled', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Compression activée</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.performance.compressionEnabled}
                                        onChange={(e) => handleInputChange('performance', 'compressionEnabled', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Rate limiting</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.performance.rateLimiting}
                                        onChange={(e) => handleInputChange('performance', 'rateLimiting', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Durée du cache (secondes)</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={settings.performance.cacheDuration}
                                    onChange={(e) => handleInputChange('performance', 'cacheDuration', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Requêtes max par minute</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={settings.performance.maxRequestsPerMinute}
                                    onChange={(e) => handleInputChange('performance', 'maxRequestsPerMinute', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Classement activé</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.enableRanking}
                                        onChange={(e) => handleInputChange('features', 'enableRanking', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Achievements activés</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.enableAchievements}
                                        onChange={(e) => handleInputChange('features', 'enableAchievements', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Chat activé</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.enableChat}
                                        onChange={(e) => handleInputChange('features', 'enableChat', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Chat vocal activé</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.enableVoiceChat}
                                        onChange={(e) => handleInputChange('features', 'enableVoiceChat', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Rôles personnalisés</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.customRoles}
                                        onChange={(e) => handleInputChange('features', 'customRoles', e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text font-semibold">Mode tournoi</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.features.tournamentMode}
                                        onChange={(e) => handleInputChange('features', 'tournamentMode', e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const tabs = [
        { id: 'general', label: 'Général', icon: Globe },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'performance', label: 'Performance', icon: Server },
        { id: 'features', label: 'Fonctionnalités', icon: Gamepad2 }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Paramètres administrateur
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Configuration globale de la plateforme
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        className="btn btn-outline"
                        onClick={handleReset}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réinitialiser
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="card-body p-0">
                    <div className="tabs tabs-boxed bg-base-200 p-2">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6">
                        <TabContent />
                    </div>
                </div>
            </div>

            {/* Section actions critiques */}
            <div className="card bg-white dark:bg-gray-800 shadow-lg border border-red-200 dark:border-red-800">
                <div className="card-body">
                    <h3 className="card-title text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        Actions critiques
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Ces actions peuvent affecter significativement la plateforme
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button className="btn btn-error btn-outline btn-sm">
                            Vider le cache
                        </button>
                        <button className="btn btn-error btn-outline btn-sm">
                            Regénérer les tokens
                        </button>
                        <button className="btn btn-error btn-outline btn-sm">
                            Purger la base de données
                        </button>
                        <button className="btn btn-error btn-sm">
                            Mode maintenance forcé
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;