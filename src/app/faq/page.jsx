'use client';

import { useState } from 'react';
import Link from 'next/link';

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
            icon: "🎮",
            questions: [
                {
                    id: 'what-is',
                    question: "Qu'est-ce que Loup-Garou Online ?",
                    answer: "Loup-Garou Online est une plateforme web immersive qui vous permet de jouer au célèbre jeu de société Loup-Garou avec des amis ou d'autres joueurs en ligne. Profitez d'une expérience complète avec chat, animations, et système de rôles avancé."
                },
                {
                    id: 'how-play',
                    question: "Comment commencer à jouer ?",
                    answer: "Créez un compte gratuit, rejoignez une partie existante ou créez la vôtre ! Invitez vos amis via un lien de partage et plongez dans l'aventure. Notre interface intuitive vous guide pas à pas."
                },
                {
                    id: 'free',
                    question: "Le jeu est-il vraiment gratuit ?",
                    answer: "Oui ! L'accès de base est entièrement gratuit. Des cosmétiques optionnels (avatars, thèmes visuels) seront disponibles prochainement pour personnaliser votre expérience."
                }
            ]
        },
        game: {
            title: "Règles du Jeu",
            icon: "🐺",
            questions: [
                {
                    id: 'roles',
                    question: "Quels rôles sont disponibles ?",
                    answer: "Nous supportons tous les rôles classiques : Loups-Garous, Villageois, Voyante, Docteur, Cupidon, Sorcière, Chasseur, et bien d'autres ! Chaque rôle a des pouvoirs uniques qui influencent la partie."
                },
                {
                    id: 'phases',
                    question: "Comment fonctionnent les phases de jeu ?",
                    answer: "Le jeu alterne entre phase de Nuit (où les pouvoirs spéciaux s'activent) et phase de Jour (où les discussions et votes ont lieu). Un narrateur automatique guide la partie."
                },
                {
                    id: 'win-conditions',
                    question: "Quelles sont les conditions de victoire ?",
                    answer: "Les Villageois gagnent en éliminant tous les Loups-Garous. Les Loups-Garous gagnent lorsqu'ils sont en égalité numérique avec les Villageois. Les rôles solitaires ont leurs propres objectifs secrets !"
                },
                {
                    id: 'game-modes',
                    question: "Y a-t-il différents modes de jeu ?",
                    answer: "Oui ! Mode Classique, Mode Rapide, Mode Personnalisé où vous choisissez les rôles, et bientôt des modes spéciaux saisonniers avec des règles uniques."
                }
            ]
        },
        technical: {
            title: "Technique",
            icon: "🔧",
            questions: [
                {
                    id: 'requirements',
                    question: "Quels sont les prérequis techniques ?",
                    answer: "Un navigateur moderne (Chrome, Firefox, Safari, Edge) et une connexion internet stable. Aucune installation requise - tout fonctionne directement dans votre navigateur !"
                },
                {
                    id: 'mobile',
                    question: "Puis-je jouer sur mobile ?",
                    answer: "Absolument ! Notre site est entièrement responsive et optimisé pour mobile. L'expérience est fluide sur smartphone et tablette."
                },
                {
                    id: 'audio',
                    question: "Dois-je activer l'audio ?",
                    answer: "L'audio améliore l'immersion mais n'est pas obligatoire. Vous pouvez activer/désactiver les sons d'ambiance et les effets sonores dans les paramètres."
                },
                {
                    id: 'connection',
                    question: "Que faire en cas de problème de connexion ?",
                    answer: "Vérifiez votre connexion internet, rafraîchissez la page, ou réessayez de rejoindre la partie. Votre place est réservée quelques minutes en cas de déconnexion involontaire."
                }
            ]
        },
        community: {
            title: "Communauté",
            icon: "👥",
            questions: [
                {
                    id: 'report',
                    question: "Comment signaler un joueur ?",
                    answer: "Utilisez le bouton de signalement dans le profil du joueur ou contactez-nous directement. Notre équipe de modération traite rapidement chaque signalement."
                },
                {
                    id: 'friends',
                    question: "Puis-je jouer avec mes amis ?",
                    answer: "Bien sûr ! Créez une partie privée et partagez le lien d'invitation. Vous pouvez aussi former des groupes permanents pour jouer régulièrement ensemble."
                },
                {
                    id: 'language',
                    question: "Le jeu est-il disponible en plusieurs langues ?",
                    answer: "Actuellement en français, mais nous travaillons sur les versions anglaise et espagnole. Rejoignez notre Discord pour suivre les avancées !"
                }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        ❓ FAQ Loup-Garou
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Trouvez rapidement les réponses à toutes vos questions sur le jeu Loup-Garou Online
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {Object.entries(categories).map(([key, category]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                activeCategory === key
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/25'
                                    : 'bg-base-200/30 text-gray-300 hover:bg-base-200/50 border border-white/10'
                            }`}
                        >
                            <span className="text-lg mr-2">{category.icon}</span>
                            {category.title}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {categories[activeCategory].questions.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-purple-500/30"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                                            ?
                                        </div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                            {item.question}
                                        </h3>
                                    </div>
                                    <div className={`transform transition-transform duration-300 ${
                                        openItems[item.id] ? 'rotate-180' : ''
                                    }`}>
                                        <span className="text-2xl text-purple-400">⌄</span>
                                    </div>
                                </button>

                                <div className={`transition-all duration-300 overflow-hidden ${
                                    openItems[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="px-6 pb-5">
                                        <div className="pl-12 border-l-2 border-purple-500/50">
                                            <p className="text-gray-300 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            🎯 Vous ne trouvez pas votre réponse ?
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Notre équipe de support est là pour vous aider rapidement et efficacement.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link className="btn btn-primary px-8" href="/contact">
                                📧 Contactez le Support
                            </Link>
                            <Link href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" className="btn btn-outline btn-primary px-8">
                                💬 Discord Communauté
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-base-200/20 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-purple-400 mb-2">10k+</div>
                            <div className="text-gray-400 text-sm">Parties jouées</div>
                        </div>
                        <div className="text-center p-4 bg-base-200/20 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-blue-400 mb-2">5k+</div>
                            <div className="text-gray-400 text-sm">Joueurs actifs</div>
                        </div>
                        <div className="text-center p-4 bg-base-200/20 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                            <div className="text-gray-400 text-sm">Support disponible</div>
                        </div>
                        <div className="text-center p-4 bg-base-200/20 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                            <div className="text-gray-400 text-sm">Uptime serveur</div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-block p-6 bg-base-200/20 rounded-2xl border border-white/10 max-w-2xl">
                        <p className="text-gray-300 italic text-lg">
                            &ldquo;Dans l&apos;ombre de la nuit, la vérité se révèle...
                            Mais même les loups ont besoin d&apos;aide parfois !&rdquo;
                        </p>
                        <p className="text-gray-500 text-sm mt-2">— La Voyante du Support</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .faq-item {
                    animation: fadeInUp 0.5s ease-out both;
                }
            `}</style>
        </div>
    );
};

export default FAQPage;