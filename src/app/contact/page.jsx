'use client';

import { useState } from 'react';
import Link from 'next/link';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
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
                category: 'general',
                message: '',
                urgency: 'medium'
            });

            setTimeout(() => setSubmitStatus(null), 5000);
        }, 2000);
    };

    const contactCategories = [
        {
            id: 'general',
            title: '💬 Question Générale',
            icon: '💬',
            description: 'Informations, fonctionnalités',
            color: 'from-blue-500 to-cyan-500',
            responseTime: '24h'
        },
        {
            id: 'technical',
            title: '🔧 Problème Technique',
            icon: '🔧',
            description: 'Bugs, performances, erreurs',
            color: 'from-purple-500 to-pink-500',
            responseTime: '12h'
        },
        {
            id: 'account',
            title: '👤 Problème de Compte',
            icon: '👤',
            description: 'Connexion, sécurité, données',
            color: 'from-green-500 to-emerald-500',
            responseTime: '6h'
        },
        {
            id: 'report',
            title: '🚨 Signaler un Joueur',
            icon: '🚨',
            description: 'Comportement abusif, triche',
            color: 'from-red-500 to-rose-500',
            responseTime: '2h'
        },
        {
            id: 'suggestion',
            title: '💡 Suggestion & Idées',
            icon: '💡',
            description: 'Améliorations, nouvelles features',
            color: 'from-indigo-500 to-purple-500',
            responseTime: '72h'
        }
    ];

    const urgencyLevels = [
        {
            value: 'low',
            label: '🟢 Peu urgent',
            description: 'Question générale, curiosité',
            color: 'bg-green-500/20 border-green-500/50 text-green-300'
        },
        {
            value: 'medium',
            label: '🟡 Normal',
            description: 'Problème gênant mais tolérable',
            color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
        },
        {
            value: 'high',
            label: '🟠 Urgent',
            description: 'Impossible de jouer normalement',
            color: 'bg-orange-500/20 border-orange-500/50 text-orange-300'
        },
        {
            value: 'critical',
            label: '🔴 Critique',
            description: 'Sécurité, compte compromis',
            color: 'bg-red-500/20 border-red-500/50 text-red-300'
        }
    ];

    const teamMembers = [
        {
            name: "Alexandre",
            role: "Support Technique",
            specialty: "Bugs & Performance",
            avatar: "👨‍💻",
            status: "🟢 En ligne"
        },
        {
            name: "Sophie",
            role: "Community Manager",
            specialty: "Relations joueurs",
            avatar: "👩‍💼",
            status: "🟢 En ligne"
        },
        {
            name: "Thomas",
            role: "Développeur Principal",
            specialty: "Problèmes complexes",
            avatar: "🧙‍♂️",
            status: "🟡 Absent"
        },
        {
            name: "Marie",
            role: "Modératrice",
            specialty: "Signalements urgents",
            avatar: "🦸‍♀️",
            status: "🟢 En ligne"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="text-center mb-16">
                    <div className="relative inline-block mb-6">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                            📮 Nous Contacter
                        </h1>
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl rounded-full"></div>
                    </div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Notre meute de support est là pour vous aider ! Que vous soyez un loup expérimenté
                        ou un nouveau villageois, nous répondons à toutes vos questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                🛡️ Notre Équipe
                                <span className="ml-2 text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                    En ligne maintenant
                                </span>
                            </h3>
                            <div className="space-y-4">
                                {teamMembers.map((member, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 bg-base-200/50 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                        <div className="text-3xl">{member?.avatar}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-white">{member.name}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    member.status.includes('🟢') ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                    {member.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">{member.role}</p>
                                            <p className="text-purple-400 text-xs">{member.specialty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 p-6">
                            <h3 className="text-xl font-bold text-white mb-4">📊 Notre Performance</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Temps de réponse moyen</span>
                                    <span className="text-green-400 font-bold">2h 15min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Taux de satisfaction</span>
                                    <span className="text-yellow-400 font-bold">98%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Requêtes traitées</span>
                                    <span className="text-blue-400 font-bold">12,458</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-xl font-bold text-white mb-4">⚡ Contacts Rapides</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-3 bg-discord/20 hover:bg-discord/30 border border-discord/30 rounded-xl transition-all group">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">💬</span>
                                        <div>
                                            <div className="font-semibold text-white">Discord</div>
                                            <div className="text-gray-400 text-sm group-hover:text-gray-300">Support en temps réel</div>
                                        </div>
                                    </div>
                                </button>
                                <button className="w-full text-left p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition-all group">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">📞</span>
                                        <div>
                                            <div className="font-semibold text-white">Urgences</div>
                                            <div className="text-gray-400 text-sm group-hover:text-gray-300">Problèmes critiques uniquement</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white">
                                    ✉️ Envoyer un Message
                                </h2>
                                <div className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                                    Réponse garantée
                                </div>
                            </div>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">🎉</span>
                                        <div>
                                            <div className="font-semibold">Message envoyé avec succès !</div>
                                            <div className="text-sm opacity-90">
                                                Nous vous répondrons dans les plus brefs délais. Merci pour votre patience.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Votre nom</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="input input-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                            placeholder="Comment souhaitez-vous qu'on vous appelle ?"
                                            required
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input input-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Type de demande</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="select select-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                        >
                                            {contactCategories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.title} ({category.responseTime})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Niveau d'urgence</span>
                                        </label>
                                        <select
                                            name="urgency"
                                            value={formData.urgency}
                                            onChange={handleInputChange}
                                            className="select select-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                        >
                                            {urgencyLevels.map(level => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white font-semibold">Sujet du message</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="input input-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                        placeholder="Décrivez brièvement votre demande..."
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white font-semibold">Votre message</span>
                                        <span className="label-text-alt text-gray-400">
                                            {formData.message.length}/1000 caractères
                                        </span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={8}
                                        className="textarea textarea-bordered bg-base-200/50 border-white/10 focus:border-purple-500 transition-colors"
                                        placeholder="Décrivez votre problème ou demande en détail... Plus vous serez précis, mieux nous pourrons vous aider !"
                                        maxLength={1000}
                                        required
                                    />
                                </div>

                                <div className="form-control pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`btn btn-lg bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all ${
                                            isSubmitting ? 'loading' : ''
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xl">🚀</span>
                                                Envoyer mon message
                                            </>
                                        )}
                                    </button>
                                    <div className="text-center mt-3">
                                        <span className="text-gray-400 text-sm">
                                            Temps de réponse estimé: {
                                            contactCategories.find(cat => cat.id === formData.category)?.responseTime
                                        }
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                    <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/10 hover:border-green-500/30 transition-colors">
                        <div className="text-4xl mb-4">🔒</div>
                        <h4 className="text-xl font-bold text-white mb-2">Confidentialité</h4>
                        <p className="text-gray-300">
                            Vos données sont sécurisées et jamais partagées
                        </p>
                    </div>
                    <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors">
                        <div className="text-4xl mb-4">⚡</div>
                        <h4 className="text-xl font-bold text-white mb-2">Rapidité</h4>
                        <p className="text-gray-300">
                            Réponse moyenne sous 2 heures pour les urgences
                        </p>
                    </div>
                    <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors">
                        <div className="text-4xl mb-4">🎯</div>
                        <h4 className="text-xl font-bold text-white mb-2">Efficacité</h4>
                        <p className="text-gray-300">
                            98% des problèmes résolus en moins de 24h
                        </p>
                    </div>
                </div>

                <div className="text-center p-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/20">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        🐺 Prêt à rejoindre la meute ?
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Notre communauté de loups et villageois vous attend.
                        Des milliers de joueurs vous ont déjà rejoint dans l'aventure !
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn btn-primary btn-lg px-8">
                            🎮 Rejoindre une Partie
                        </button>
                        <Link href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" className="btn btn-outline btn-primary btn-lg px-8">
                            💬 Discuter sur Discord
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-discord {
                    background-color: #5865F2;
                }
            `}</style>
        </div>
    );
};

export default ContactPage;