'use client';

import { useState } from 'react';

const TermsPage = () => {
    const [activeSection, setActiveSection] = useState('acceptance');
    const [acceptedSections, setAcceptedSections] = useState(new Set());

    const toggleAcceptSection = (sectionId) => {
        setAcceptedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const sections = [
        {
            id: 'acceptance',
            title: 'Acceptation',
            icon: '✅',
            required: true
        },
        {
            id: 'account',
            title: 'Compte Utilisateur',
            icon: '👤',
            required: true
        },
        {
            id: 'rules',
            title: 'Règles de Jeu',
            icon: '🐺',
            required: true
        },
        {
            id: 'content',
            title: 'Contenu & Chat',
            icon: '💬',
            required: true
        },
        {
            id: 'moderation',
            title: 'Modération',
            icon: '🛡️',
            required: true
        },
        {
            id: 'liability',
            title: 'Responsabilité',
            icon: '⚖️',
            required: true
        },
        {
            id: 'termination',
            title: 'Résiliation',
            icon: '🚪',
            required: true
        }
    ];

    const content = {
        acceptance: {
            title: "✅ Acceptation des Conditions",
            lastUpdated: "15 Décembre 2024",
            content: `
                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                    <h4 class="text-lg font-bold text-blue-300 mb-2">📋 Aperçu des Conditions</h4>
                    <p class="text-blue-200">
                        En créant un compte ou en utilisant Loup-Garou Online, vous acceptez l'ensemble 
                        des conditions décrites dans ce document. Prenez le temps de les lire attentivement.
                    </p>
                </div>

                <h4 class="font-bold text-white mb-3">Portée des Conditions</h4>
                <p class="mb-4 text-gray-300">
                    Les présentes Conditions d'Utilisation régissent votre utilisation de la plateforme 
                    Loup-Garou Online, incluant le site web, les applications, et tous les services associés.
                </p>

                <h4 class="font-bold text-white mb-3">Modifications des Conditions</h4>
                <p class="mb-4 text-gray-300">
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
                    majeures vous seront notifiées par email. Votre utilisation continue du service vaut 
                    acceptation des nouvelles conditions.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <h5 class="font-bold text-green-300 mb-2">✅ Ce qui est autorisé</h5>
                        <ul class="list-disc list-inside space-y-1 text-green-200 text-sm">
                            <li>Jouer dans le respect des autres</li>
                            <li>Créer du contenu approprié</li>
                            <li>Signaler les problèmes</li>
                            <li>Partager des retours constructifs</li>
                        </ul>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <h5 class="font-bold text-red-300 mb-2">❌ Ce qui est interdit</h5>
                        <ul class="list-disc list-inside space-y-1 text-red-200 text-sm">
                            <li>Triche ou exploitation de bugs</li>
                            <li>Comportement toxique</li>
                            <li>Spam ou publicité</li>
                            <li>Usurpation d'identité</li>
                        </ul>
                    </div>
                </div>
            `
        },
        account: {
            title: "👤 Compte Utilisateur",
            content: `
                <h4 class="font-bold text-white mb-3">Création de Compte</h4>
                <p class="mb-4 text-gray-300">
                    Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous devez fournir 
                    des informations exactes et complètes, et maintenir ces informations à jour.
                </p>

                <div class="space-y-4 mb-6">
                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-green-400">🔒</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Sécurité du Compte</h4>
                            <p class="text-gray-300 text-sm">
                                Vous êtes responsable de la confidentialité de votre mot de passe et de toutes 
                                les activités sur votre compte. Signalez immédiatement toute utilisation non autorisée.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-blue-400">👤</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Pseudonyme et Avatar</h4>
                            <p class="text-gray-300 text-sm">
                                Votre pseudonyme et avatar ne doivent pas être offensants, trompeurs ou violer 
                                les droits de propriété intellectuelle de tiers.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-purple-400">🚫</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Comptes Multiples</h4>
                            <p class="text-gray-300 text-sm">
                                Chaque joueur ne peut avoir qu'un seul compte. Les comptes multiples sont interdits 
                                et entraîneront la suspension de tous vos comptes.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-yellow-300 mb-2">Âge Minimum Requis</h4>
                    <p class="text-yellow-200">
                        Vous devez avoir au moins <strong>13 ans</strong> pour créer un compte. Les joueurs âgés de 13 à 15 ans 
                        doivent avoir l'autorisation parentale. Nous nous réservons le droit de demander une preuve d'âge.
                    </p>
                </div>
            `
        },
        rules: {
            title: "🐺 Règles de Jeu",
            content: `
                <p class="mb-4 text-gray-300">
                    Pour garantir une expérience de jeu agréable pour tous, nous attendons de chaque joueur 
                    qu'il respecte les règles suivantes :
                </p>

                <div class="space-y-4 mb-6">
                    <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <h4 class="font-bold text-green-300 mb-2">🎯 Comportement en Partie</h4>
                        <ul class="list-disc list-inside space-y-2 text-green-200">
                            <li>Respectez les autres joueurs, qu'ils soient villageois ou loups-garous</li>
                            <li>Jouez votre rôle avec fair-play et sans tricher</li>
                            <li>Ne révélez pas votre rôle après votre mort (sauf si les règles le permettent)</li>
                            <li>Participez activement aux discussions et votes</li>
                        </ul>
                    </div>

                    <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <h4 class="font-bold text-red-300 mb-2">🚫 Triche et Exploitation</h4>
                        <ul class="list-disc list-inside space-y-2 text-red-200">
                            <li>L'utilisation de bots, scripts ou logiciels tiers est strictement interdite</li>
                            <li>L'exploitation de bugs ou failles techniques est prohibée</li>
                            <li>La coordination hors-jeu pour avantager son équipe est considérée comme de la triche</li>
                            <li>La vente ou l'échange de comptes/objets est interdite</li>
                        </ul>
                    </div>

                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h4 class="font-bold text-blue-300 mb-2">⚡ Règles Techniques</h4>
                        <ul class="list-disc list-inside space-y-2 text-blue-200">
                            <li>Ne tentez pas de surcharger ou perturber les serveurs</li>
                            <li>Respectez les limites d'usage raisonnable du service</li>
                            <li>N'utilisez pas le service pour des activités illégales</li>
                            <li>Signalez les problèmes techniques via les canaux appropriés</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-purple-300 mb-2">🎮 Esprit Sportif</h4>
                    <p class="text-purple-200">
                        Loup-Garou Online est avant tout un jeu. L'objectif est de s'amuser ensemble. 
                        Même dans la défaite, gardez un esprit sportif et respectueux envers vos adversaires.
                    </p>
                </div>
            `
        },
        content: {
            title: "💬 Contenu & Chat",
            content: `
                <h4 class="font-bold text-white mb-3">Responsabilité du Contenu</h4>
                <p class="mb-4 text-gray-300">
                    Vous êtes entièrement responsable du contenu que vous publiez sur la plateforme, 
                    incluant les messages de chat, les pseudonymes, les avatars et toute autre communication.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="space-y-4">
                        <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <h4 class="font-bold text-red-300 mb-2">🚫 Contenu Interdit</h4>
                            <ul class="list-disc list-inside space-y-1 text-red-200 text-sm">
                                <li>Contenu haineux ou discriminatoire</li>
                                <li>Harcèlement ou intimidation</li>
                                <li>Spam ou publicité non sollicitée</li>
                                <li>Informations personnelles d'autrui</li>
                                <li>Contenu sexuellement explicite</li>
                                <li>Incitation à la violence</li>
                                <li>Menaces ou chantage</li>
                            </ul>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <h4 class="font-bold text-green-300 mb-2">✅ Communication Saine</h4>
                            <ul class="list-disc list-inside space-y-1 text-green-200 text-sm">
                                <li>Respectez les opinions différentes</li>
                                <li>Utilisez un langage courtois</li>
                                <li>Signalez les comportements abusifs</li>
                                <li>Partagez des stratégies constructives</li>
                                <li>Aidez les nouveaux joueurs</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                    <h4 class="font-bold text-yellow-300 mb-2">📝 Modération Proactive</h4>
                    <p class="text-yellow-200 text-sm">
                        Tous les messages peuvent être modérés. Nous nous réservons le droit de supprimer 
                        tout contenu violant ces règles sans préavis. Les infractions répétées entraîneront 
                        la suspension ou le bannissement de votre compte.
                    </p>
                </div>

                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-blue-300 mb-2">🔍 Conservation des Données</h4>
                    <p class="text-blue-200 text-sm">
                        Nous conservons les logs de chat pour des raisons de modération et de sécurité. 
                        Ces données peuvent être utilisées pour enquêter sur des comportements inappropriés 
                        et sont supprimées après 90 jours, sauf en cas d'enquête en cours.
                    </p>
                </div>
            `
        },
        moderation: {
            title: "🛡️ Système de Modération",
            content: `
                <h4 class="font-bold text-white mb-3">Notre Approche de la Modération</h4>
                <p class="mb-4 text-gray-300">
                    Nous nous engageons à maintenir un environnement de jeu sain et respectueux. 
                    Notre système de modération est conçu pour être juste, transparent et efficace.
                </p>

                <div class="space-y-4 mb-6">
                    <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <h4 class="font-bold text-green-300 mb-2">📊 Échelle de Sanctions</h4>
                        <div class="space-y-3 text-green-200 text-sm">
                            <div class="flex justify-between items-center">
                                <span>Avertissement</span>
                                <span class="badge badge-warning">Première infraction mineure</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Mute temporaire</span>
                                <span class="badge badge-warning">1h - 24h</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Suspension de compte</span>
                                <span class="badge badge-error">1 - 7 jours</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Bannissement permanent</span>
                                <span class="badge badge-error">Infractions graves/répétées</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h4 class="font-bold text-blue-300 mb-2">🔄 Processus d'Appel</h4>
                        <p class="text-blue-200 text-sm mb-3">
                            Si vous estimez avoir été sanctionné injustement, vous pouvez faire appel de la décision.
                        </p>
                        <ul class="list-disc list-inside space-y-1 text-blue-200 text-sm">
                            <li>Contactez notre équipe de modération via le formulaire dédié</li>
                            <li>Fournissez des preuves ou contextes supplémentaires</li>
                            <li>Notre équipe réexaminera votre cas sous 72h</li>
                            <li>La décision finale appartient à notre équipe de modération</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-purple-300 mb-2">👥 Signalements Communautaires</h4>
                    <p class="text-purple-200 text-sm">
                        Vous pouvez signaler tout comportement inapproprié via le système de signalement intégré. 
                        Chaque signalement est examiné par notre équipe. Les signalements abusifs peuvent entraîner 
                        des sanctions pour le joueur signalant.
                    </p>
                </div>
            `
        },
        liability: {
            title: "⚖️ Responsabilités",
            content: `
                <h4 class="font-bold text-white mb-3">Limitation de Responsabilité</h4>
                <p class="mb-4 text-gray-300">
                    Loup-Garou Online est fourni "en l'état" et "selon disponibilité". Dans la mesure 
                    permise par la loi, nous déclinons toute responsabilité pour :
                </p>

                <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-3 p-3 bg-base-200/30 rounded-lg border border-white/10">
                        <div class="text-red-400">🔧</div>
                        <span class="text-gray-300">Pertes de données ou interruptions de service</span>
                    </div>
                    <div class="flex items-center space-x-3 p-3 bg-base-200/30 rounded-lg border border-white/10">
                        <div class="text-red-400">🎮</div>
                        <span class="text-gray-300">Comportements d'autres joueurs</span>
                    </div>
                    <div class="flex items-center space-x-3 p-3 bg-base-200/30 rounded-lg border border-white/10">
                        <div class="text-red-400">💸</div>
                        <span class="text-gray-300">Pertes de revenus ou opportunités manquées</span>
                    </div>
                    <div class="flex items-center space-x-3 p-3 bg-base-200/30 rounded-lg border border-white/10">
                        <div class="text-red-400">🖥️</div>
                        <span class="text-gray-300">Dommages à votre équipement</span>
                    </div>
                </div>

                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <h4 class="font-bold text-blue-300 mb-2">🔧 Maintenance et Interruptions</h4>
                    <p class="text-blue-200 text-sm">
                        Nous nous efforçons de maintenir un service disponible 24h/24 et 7j/7, mais nous 
                        pouvons interrompre le service pour maintenance, mises à jour ou raisons techniques 
                        sans préavis. Nous ne sommes pas responsables des interruptions de service.
                    </p>
                </div>

                <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-yellow-300 mb-2">📝 Modifications du Service</h4>
                    <p class="text-yellow-200">
                        Nous nous réservons le droit de modifier, suspendre ou interrompre toute fonctionnalité 
                        du service à tout moment, sans responsabilité envers les utilisateurs.
                    </p>
                </div>
            `
        },
        termination: {
            title: "🚪 Résiliation",
            content: `
                <h4 class="font-bold text-white mb-3">Résiliation par l'Utilisateur</h4>
                <p class="mb-4 text-gray-300">
                    Vous pouvez résilier votre compte à tout moment via les paramètres de votre compte. 
                    La résiliation est effective immédiatement.
                </p>

                <div class="space-y-4 mb-6">
                    <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <h4 class="font-bold text-red-300 mb-2">🚫 Résiliation par Nos Soins</h4>
                        <p class="text-red-200 text-sm mb-3">
                            Nous pouvons suspendre ou résilier votre accès au service sans préavis pour :
                        </p>
                        <ul class="list-disc list-inside space-y-1 text-red-200 text-sm">
                            <li>Violation des présentes conditions d'utilisation</li>
                            <li>Comportement frauduleux ou abusif</li>
                            <li>Activités illégales</li>
                            <li>Tentative de nuire au service ou à d'autres utilisateurs</li>
                        </ul>
                    </div>

                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h4 class="font-bold text-blue-300 mb-2">📊 Conséquences de la Résiliation</h4>
                        <ul class="list-disc list-inside space-y-2 text-blue-200">
                            <li>Accès immédiatement révoqué au service</li>
                            <li>Suppression de votre pseudonyme et profil</li>
                            <li>Perte de tous les achats et cosmétiques (non remboursables)</li>
                            <li>Conservation des données nécessaires aux obligations légales</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-green-300 mb-2">📝 Processus de Suppression</h4>
                    <p class="text-green-200 text-sm">
                        Après résiliation, vos données personnelles sont anonymisées dans un délai de 30 jours, 
                        sauf obligation légale de conservation. Les données de gameplay anonymisées peuvent être 
                        conservées à des fins statistiques.
                    </p>
                </div>
            `
        }
    };

    const allRequiredAccepted = sections
        .filter(section => section.required)
        .every(section => acceptedSections.has(section.id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        📝 Conditions d'Utilisation
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Les règles de la meute - Pour une expérience de jeu équitable et agréable
                    </p>
                    <div className="mt-4 text-gray-400">
                        Dernière mise à jour : {content.acceptance.lastUpdated}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Sections</h3>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                            activeSection === section.id
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{section.icon}</span>
                                                <span className="font-medium">{section.title}</span>
                                            </div>
                                            {section.required && (
                                                <div className={`w-2 h-2 rounded-full ${
                                                    acceptedSections.has(section.id) ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-2">Progression</div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${(acceptedSections.size / sections.filter(s => s.required).length) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {acceptedSections.size} / {sections.filter(s => s.required).length} sections requises
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white">
                                    {content[activeSection].icon} {content[activeSection].title}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    {sections.find(s => s.id === activeSection)?.required && (
                                        <button
                                            onClick={() => toggleAcceptSection(activeSection)}
                                            className={`btn btn-sm ${
                                                acceptedSections.has(activeSection)
                                                    ? 'btn-success'
                                                    : 'btn-outline btn-primary'
                                            }`}
                                        >
                                            {acceptedSections.has(activeSection) ? '✅ Accepté' : '👁️ Marquer comme lu'}
                                        </button>
                                    )}
                                    <div className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                                        {sections.find(s => s.id === activeSection)?.required ? 'Obligatoire' : 'Informative'}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="prose prose-invert max-w-none mb-8"
                                dangerouslySetInnerHTML={{ __html: content[activeSection].content }}
                            />

                            <div className="mt-12 pt-6 border-t border-white/10">
                                <div className="flex justify-between">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            const currentIndex = sections.findIndex(s => s.id === activeSection);
                                            if (currentIndex > 0) {
                                                setActiveSection(sections[currentIndex - 1].id);
                                            }
                                        }}
                                        disabled={activeSection === 'acceptance'}
                                    >
                                        ← Section précédente
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            const currentIndex = sections.findIndex(s => s.id === activeSection);
                                            if (currentIndex < sections.length - 1) {
                                                setActiveSection(sections[currentIndex + 1].id);
                                            }
                                            if (sections.find(s => s.id === activeSection)?.required) {
                                                toggleAcceptSection(activeSection);
                                            }
                                        }}
                                        disabled={activeSection === 'termination'}
                                    >
                                        Section suivante →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {allRequiredAccepted ? '🎉 Conditions Acceptées !' : '📝 Acceptation des Conditions'}
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    {allRequiredAccepted
                                        ? 'Vous avez accepté toutes les sections obligatoires. Vous pouvez maintenant profiter pleinement de Loup-Garou Online !'
                                        : 'Veuillez lire et accepter toutes les sections obligatoires avant de continuer.'
                                    }
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        className={`btn btn-lg ${
                                            allRequiredAccepted
                                                ? 'btn-success'
                                                : 'btn-primary'
                                        }`}
                                        disabled={!allRequiredAccepted}
                                    >
                                        {allRequiredAccepted ? '🚀 Commencer à Jouer' : 'Sections manquantes'}
                                    </button>
                                    <button className="btn btn-outline btn-primary btn-lg">
                                        📥 Télécharger en PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .prose {
                    line-height: 1.7;
                }
                .prose ul {
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                }
                .prose li {
                    margin-bottom: 0.5rem;
                }
                .prose strong {
                    color: #e5e7eb;
                    font-weight: 600;
                }
                .prose h4 {
                    color: #f3f4f6;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
            `}</style>
        </div>
    );
};

export default TermsPage;