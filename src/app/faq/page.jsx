'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    HelpCircle,
    Gamepad2,
    Users,
    Settings,
    MessageSquare,
    Shield,
    Zap,
    Globe,
    Smartphone,
    Headphones,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Mail,
    ExternalLink,
    Star,
    Clock,
    Trophy,
    CheckCircle, Check, CloudCheck, RefreshCcw
} from 'lucide-react';

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const categories = {
        general: {
            title: "Général",
            icon: <HelpCircle className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            questions: [
                {
                    id: 'what-is',
                    question: "Qu'est-ce que Loup-Garou Online ?",
                    answer: "Loup-Garou Online est une plateforme web immersive qui vous permet de jouer au célèbre jeu de société Loup-Garou avec des amis ou d'autres joueurs en ligne. Profitez d'une expérience complète avec chat, animations, sons, et système de rôles avancé."
                },
                {
                    id: 'how-play',
                    question: "Comment commencer à jouer ?",
                    answer: "Créez un compte gratuit, rejoignez une partie existante ou créez la vôtre ! Invitez vos amis via un lien de partage. Notre interface intuitive vous guide à chaque étape du processus."
                },
                {
                    id: 'free',
                    question: "Le jeu est-il vraiment gratuit ?",
                    answer: "Oui ! L'accès de base est entièrement gratuit. Des options cosmétiques (avatars, thèmes visuels) seront disponibles pour personnaliser votre expérience, mais le jeu reste pleinement fonctionnel sans aucun achat."
                }
            ]
        },
        game: {
            title: "Règles du Jeu",
            icon: <Gamepad2 className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            questions: [
                {
                    id: 'roles',
                    question: "Quels rôles sont disponibles ?",
                    answer: "Nous supportons tous les rôles classiques : Loups-Garous, Villageois, Voyante, Garde, Cupidon, Sorcière, Chasseur, et bien d'autres ! Chaque rôle a des pouvoirs uniques qui influencent la partie de manière stratégique."
                },
                {
                    id: 'phases',
                    question: "Comment fonctionnent les phases de jeu ?",
                    answer: "Le jeu alterne entre phase de Nuit (actions secrètes et pouvoirs spéciaux) et phase de Jour (discussions et votes publics). Un narrateur automatique guide la partie pour une expérience fluide."
                },
                {
                    id: 'win-conditions',
                    question: "Quelles sont les conditions de victoire ?",
                    answer: "Les Villageois gagnent en éliminant tous les Loups-Garous. Les Loups-Garous gagnent lorsqu'ils égalent ou dépassent le nombre de villageois. Les rôles solitaires ont leurs propres objectifs secrets à accomplir !"
                },
                {
                    id: 'game-modes',
                    question: "Y a-t-il différents modes de jeu ?",
                    answer: "Oui ! Mode Classique, Mode Personnalisé (vous choisissez les rôles), et bientôt des modes spéciaux saisonniers avec des règles uniques et des récompenses exclusives."
                }
            ]
        },
        technical: {
            title: "Technique",
            icon: <Settings className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            questions: [
                {
                    id: 'requirements',
                    question: "Quels sont les prérequis techniques ?",
                    answer: "Un navigateur moderne (Chrome, Firefox, Safari, Edge) et une connexion internet stable. Aucune installation requise - tout fonctionne directement dans votre navigateur grâce aux technologies web modernes."
                },
                {
                    id: 'mobile',
                    question: "Puis-je jouer sur mobile ?",
                    answer: "Absolument ! Notre site est entièrement responsive et optimisé pour mobile. L'expérience est fluide sur smartphone et tablette, avec des contrôles adaptés aux écrans tactiles."
                },
                {
                    id: 'audio',
                    question: "Dois-je activer l'audio ?",
                    answer: "L'audio améliore l'immersion mais n'est pas obligatoire. Vous pouvez activer/désactiver les sons d'ambiance et les effets sonores dans les paramètres de chaque partie."
                },
                {
                    id: 'connection',
                    question: "Que faire en cas de problème de connexion ?",
                    answer: "Vérifiez votre connexion internet, rafraîchissez la page, ou réessayez de rejoindre la partie. Votre place est réservée 5 minutes en cas de déconnexion involontaire."
                }
            ]
        },
        community: {
            title: "Communauté",
            icon: <Users className="w-5 h-5" />,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            questions: [
                {
                    id: 'report',
                    question: "Comment signaler un joueur inapproprié ?",
                    answer: "Utilisez le bouton de signalement dans le profil du joueur ou contactez-nous directement via le formulaire de contact. Notre équipe de modération traite chaque signalement dans les 24 heures."
                },
                {
                    id: 'friends',
                    question: "Puis-je jouer avec mes amis ?",
                    answer: "Bien sûr ! Créez une partie et partagez le lien d'invitation. Vous pouvez aussi former des groupes permanents pour jouer régulièrement ensemble et suivre vos statistiques communes."
                },
                {
                    id: 'language',
                    question: "Le jeu est-il disponible en plusieurs langues ?",
                    answer: "Actuellement en français, mais nous travaillons activement sur les versions anglaise et espagnole. Rejoignez notre Discord pour suivre l'avancement des traductions !"
                }
            ]
        }
    };

    const stats = [
        { icon: <Trophy className="w-6 h-6" />, value: "10k+", label: "Parties jouées", color: "text-purple-600 dark:text-purple-400" },
        { icon: <Users className="w-6 h-6" />, value: "5k+", label: "Joueurs actifs", color: "text-blue-600 dark:text-blue-400" },
        { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Support disponible", color: "text-green-600 dark:text-green-400" },
        { icon: <Zap className="w-6 h-6" />, value: "99.9%", label: "Uptime serveur", color: "text-yellow-600 dark:text-yellow-400" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Questions Fréquentes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Trouvez rapidement les réponses à toutes vos questions sur le jeu Loup-Garou Online
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Mis à jour quotidiennement</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {Object.entries(categories).map(([key, category]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeCategory === key
                                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {category.icon}
                            <span>{category.title}</span>
                            <span className={`text-xs ${
                                activeCategory === key ? 'text-white/80' : 'text-gray-500'
                            }`}>
                                ({category.questions.length})
                            </span>
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4 mb-16">
                        {categories[activeCategory].questions.map((item, index) => {
                            const isOpen = openItems[item.id];
                            return (
                                <div
                                    key={item.id}
                                    className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                                        isOpen ? 'shadow-md' : ''
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-lg bg-gradient-to-br ${categories[activeCategory].color}`}>
                                                <span className="text-white font-bold">?</span>
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {item.question}
                                                </h3>
                                                <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 transition-all duration-300 ${
                                                    isOpen ? 'opacity-100' : 'opacity-0 h-0'
                                                }`}>
                                                    Cliquez pour {isOpen ? 'cacher' : 'voir'} la réponse
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`transform transition-transform duration-300 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    <div className={`transition-all duration-300 overflow-hidden ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="px-6 pb-6">
                                            <div className="pl-14 border-l-2 border-blue-200 dark:border-blue-800">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 mb-4">
                                    {stat.icon}
                                </div>
                                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 mb-16">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Besoin d'aide supplémentaire ?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Notre équipe de support est disponible pour vous aider rapidement et efficacement, 7 jours sur 7.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/contact"
                                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105"
                                >
                                    <Mail className="w-5 h-5" />
                                    Contactez le Support
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-all"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Discord Communauté
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Astuces pour bien commencer
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    Sécurité
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-1 text-green-500 w-4 h-4" />
                                        <span>Ne partagez jamais vos identifiants</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-1 text-green-500 w-4 h-4" />
                                        <span>Utilisez un mot de passe unique</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-1 text-green-500 w-4 h-4" />
                                        <span>Signalez les comportements inappropriés</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-purple-500" />
                                    Accessibilité
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <Globe className="mt-1 text-purple-500 w-4 h-4" />
                                        <span>Jouez depuis n'importe quel appareil</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Smartphone className="mt-1 text-purple-500 w-4 h-4" />
                                        <span>Interface optimisée mobile</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Headphones className="mt-1 text-purple-500 w-4 h-4" />
                                        <span>Audio optionnel pour l'immersion</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-orange-500" />
                                    Performance
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <Zap className="mt-1 text-orange-500 w-4 h-4" />
                                        <span>Temps de chargement optimisés</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CloudCheck className="mt-1 text-orange-500 w-4 h-4" />
                                        <span>Faible consommation de données</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <RefreshCcw className="mt-1 text-orange-500 w-4 h-4" />
                                        <span>Mises à jour automatiques</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl shadow-sm">
                            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-4">"</div>
                            <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                                Dans l'ombre de la nuit, la vérité se révèle...
                                Mais même les loups ont besoin d'aide parfois !
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
                                — La Voyante du Support
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;