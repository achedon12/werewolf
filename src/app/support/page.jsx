'use client';

import { useState } from 'react';
import Link from 'next/link';

const SupportPage = () => {
    const [activeTab, setActiveTab] = useState('contact');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'technical',
        message: '',
        urgency: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: 'technical',
                message: '',
                urgency: 'medium'
            });

            setTimeout(() => setSubmitStatus(null), 5000);
        }, 2000);
    };

    const supportCategories = [
        {
            id: 'technical',
            title: '🔧 Problème Technique',
            icon: '🔧',
            description: 'Bugs, connexion, performances',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'gameplay',
            title: '🎮 Question de Gameplay',
            icon: '🎮',
            description: 'Règles, stratégies, mécaniques',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'account',
            title: '👤 Problème de Compte',
            icon: '👤',
            description: 'Connexion, mot de passe, profil',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'report',
            title: '🚨 Signaler un Joueur',
            icon: '🚨',
            description: 'Comportement abusif, triche',
            color: 'from-red-500 to-rose-500'
        },
        {
            id: 'suggestion',
            title: '💡 Suggestion',
            icon: '💡',
            description: 'Idées, améliorations, feedback',
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const urgencyLevels = [
        { value: 'low', label: '🟢 Peu urgent', description: 'Question générale' },
        { value: 'medium', label: '🟡 Normal', description: 'Problème gênant' },
        { value: 'high', label: '🟠 Urgent', description: 'Impossible de jouer' },
        { value: 'critical', label: '🔴 Critique', description: 'Sécurité/compte' }
    ];

    const faqQuick = [
        {
            question: "Je ne peux pas rejoindre une partie",
            answer: "Vérifiez votre connexion internet et rafraîchissez la page. Si le problème persiste, déconnectez-vous et reconnectez-vous."
        },
        {
            question: "Mon audio ne fonctionne pas",
            answer: "Vérifiez que votre navigateur a l'autorisation d'utiliser l'audio. Cliquez sur l'icône de son dans la barre d'adresse."
        },
        {
            question: "Comment signaler un bug ?",
            answer: "Utilisez le formulaire de contact en sélectionnant 'Problème Technique'. Incluez des captures d'écran si possible."
        },
        {
            question: "J'ai oublié mon mot de passe",
            answer: "Utilisez la fonction 'Mot de passe oublié' sur la page de connexion. Un email de réinitialisation vous sera envoyé."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        🛡️ Centre de Support
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Notre équipe de loups expérimentés est là pour vous aider à résoudre tous vos problèmes
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12 bg-base-200/30 backdrop-blur-sm rounded-2xl p-2 border border-white/10 max-w-2xl mx-auto">
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 min-w-[140px] ${
                            activeTab === 'contact'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        📧 Nous Contacter
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 min-w-[140px] ${
                            activeTab === 'faq'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        ❓ FAQ Rapide
                    </button>
                    <button
                        onClick={() => setActiveTab('status')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 min-w-[140px] ${
                            activeTab === 'status'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        📊 Statut des Services
                    </button>
                </div>

                <div className="max-w-4xl mx-auto">

                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <h3 className="text-xl font-bold text-white mb-6">Type de demande</h3>
                                <div className="space-y-3">
                                    {supportCategories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                                                formData.category === category.id
                                                    ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                                                    : 'bg-base-200/30 border-white/10 text-gray-300 hover:bg-base-200/50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{category.icon}</span>
                                                <div>
                                                    <div className="font-semibold">{category.title}</div>
                                                    <div className="text-sm opacity-80">{category.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                                    <h3 className="text-2xl font-bold text-white mb-6">
                                        📝 Formulaire de Contact
                                    </h3>

                                    {submitStatus === 'success' && (
                                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300">
                                            ✅ Votre message a été envoyé ! Notre équipe vous répondra dans les 24h.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text text-white">Votre nom</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered bg-base-200/50 border-white/10"
                                                    required
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text text-white">Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered bg-base-200/50 border-white/10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-white">Sujet</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="input input-bordered bg-base-200/50 border-white/10"
                                                placeholder="Décrivez brièvement votre problème..."
                                                required
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-white">Niveau d'urgence</span>
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {urgencyLevels.map(level => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                                                        className={`p-3 rounded-lg border text-sm transition-all ${
                                                            formData.urgency === level.value
                                                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                                                : 'bg-base-200/30 border-white/10 text-gray-300 hover:bg-base-200/50'
                                                        }`}
                                                    >
                                                        <div className="font-medium">{level.label}</div>
                                                        <div className="text-xs opacity-80">{level.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-white">Description détaillée</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={6}
                                                className="textarea textarea-bordered bg-base-200/50 border-white/10"
                                                placeholder="Décrivez votre problème en détail... Incluez les étapes pour le reproduire si possible."
                                                required
                                            />
                                        </div>

                                        <div className="form-control">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn btn-primary btn-lg ${
                                                    isSubmitting ? 'loading' : ''
                                                }`}
                                            >
                                                {isSubmitting ? 'Envoi en cours...' : '🚀 Envoyer la demande'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className="space-y-6">
                            <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                                <h3 className="text-2xl font-bold text-white mb-6">❓ Questions Fréquentes</h3>
                                <div className="space-y-4">
                                    {faqQuick.map((item, index) => (
                                        <div key={index} className="collapse collapse-plus bg-base-200/50 border border-white/10 rounded-xl">
                                            <input type="checkbox" />
                                            <div className="collapse-title text-lg font-medium text-white">
                                                {item.question}
                                            </div>
                                            <div className="collapse-content">
                                                <p className="text-gray-300">{item.answer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="space-y-6">
                            <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                                <h3 className="text-2xl font-bold text-white mb-6">📊 Statut des Services</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Serveurs de Jeu</span>
                                            <span className="badge badge-success">🟢 Opérationnel</span>
                                        </div>
                                        <p className="text-green-300 text-sm">Tous les serveurs fonctionnent normalement</p>
                                    </div>

                                    <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Base de Données</span>
                                            <span className="badge badge-success">🟢 Opérationnel</span>
                                        </div>
                                        <p className="text-green-300 text-sm">Performances optimales</p>
                                    </div>

                                    <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-semibold">Chat Vocal</span>
                                            <span className="badge badge-warning">🟡 Maintenance</span>
                                        </div>
                                        <p className="text-yellow-300 text-sm">Maintenance planifiée en cours</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                                    <h4 className="text-lg font-semibold text-white mb-2">📈 Statistiques Récentes</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-400">99.9%</div>
                                            <div className="text-gray-400 text-sm">Uptime</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-400">42ms</div>
                                            <div className="text-gray-400 text-sm">Latence moyenne</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-400">5k+</div>
                                            <div className="text-gray-400 text-sm">Joueurs actifs</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-yellow-400">2min</div>
                                            <div className="text-gray-400 text-sm">Temps de réponse</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/10">
                        <div className="text-4xl mb-4">💬</div>
                        <h4 className="text-xl font-bold text-white mb-2">Discord</h4>
                        <p className="text-gray-300 mb-4">Rejoignez notre communauté</p>
                        <Link href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" className="btn btn-outline btn-primary btn-sm">
                            Rejoindre le serveur
                        </Link>
                    </div>
                    <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/10">
                        <div className="text-4xl mb-4">📋</div>
                        <h4 className="text-xl font-bold text-white mb-2">Statut Live</h4>
                        <p className="text-gray-300 mb-4">Surveillez les services</p>
                        <button className="btn btn-outline btn-primary btn-sm">
                            Voir le statut
                        </button>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        🎯 Besoin d'aide immédiate ?
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Notre équipe de support est disponible 24h/24 et 7j/7 pour les urgences critiques.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;