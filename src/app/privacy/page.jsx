'use client';

import { useState } from 'react';
import Link from 'next/link';

const PrivacyPage = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        {
            id: 'introduction',
            title: 'Introduction',
            icon: '📜'
        },
        {
            id: 'data-collection',
            title: 'Données Collectées',
            icon: '🔍'
        },
        {
            id: 'data-usage',
            title: 'Utilisation des Données',
            icon: '🎯'
        },
        {
            id: 'data-sharing',
            title: 'Partage des Données',
            icon: '🤝'
        },
        {
            id: 'security',
            title: 'Sécurité',
            icon: '🛡️'
        },
        {
            id: 'rights',
            title: 'Vos Droits',
            icon: '⚖️'
        },
        {
            id: 'contact',
            title: 'Contact',
            icon: '📮'
        }
    ];

    const content = {
        introduction: {
            title: "📜 Politique de Confidentialité",
            lastUpdated: "15 Décembre 2024",
            content: `
                <p class="mb-4">Bienvenue sur <strong>Loup-Garou Online</strong>. Votre vie privée est notre priorité. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.</p>
                
                <p class="mb-4">En utilisant notre service, vous acceptez les pratiques décrites dans cette politique. Nous nous engageons à être transparent sur le traitement de vos données.</p>
                
                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 my-4">
                    <h4 class="font-bold text-blue-300 mb-2">🐺 Notre Engagement</h4>
                    <p class="text-blue-200 text-sm">Nous traitons vos données avec le plus grand respect et dans le strict respect du RGPD.</p>
                </div>
            `
        },
        'data-collection': {
            title: "🔍 Données Que Nous Collectons",
            content: `
                <h4 class="font-bold text-white mb-3">Données que vous nous fournissez directement :</h4>
                <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
                    <li><strong>Informations de compte :</strong> Nom, email, pseudonyme</li>
                    <li><strong>Profil utilisateur :</strong> Avatar, biographie, préférences</li>
                    <li><strong>Contenu de jeu :</strong> Messages chat, actions en partie</li>
                    <li><strong>Support :</strong> Messages d'assistance, signalements</li>
                </ul>

                <h4 class="font-bold text-white mb-3">Données collectées automatiquement :</h4>
                <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
                    <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, appareil</li>
                    <li><strong>Données d'usage :</strong> Temps de jeu, parties jouées, préférences</li>
                    <li><strong>Cookies :</strong> Sessions, préférences, analytics</li>
                </ul>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <h5 class="font-bold text-green-300 mb-2">✅ Collectées</h5>
                        <p class="text-green-200 text-sm">Données nécessaires au fonctionnement du jeu</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <h5 class="font-bold text-red-300 mb-2">❌ Jamais Collectées</h5>
                        <p class="text-red-200 text-sm">Données sensibles, informations bancaires</p>
                    </div>
                </div>
            `
        },
        'data-usage': {
            title: "🎯 Comment Nous Utilisons Vos Données",
            content: `
                <div class="space-y-6">
                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl">🎮</div>
                        <div>
                            <h4 class="font-bold text-white mb-2">Fournir le Service de Jeu</h4>
                            <p class="text-gray-300 text-sm">Gestion de compte, parties multijoueurs, chat, progression</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl">🛡️</div>
                        <div>
                            <h4 class="font-bold text-white mb-2">Sécurité et Modération</h4>
                            <p class="text-gray-300 text-sm">Prévention de la triche, modération des comportements abusifs</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl">📈</div>
                        <div>
                            <h4 class="font-bold text-white mb-2">Amélioration du Service</h4>
                            <p class="text-gray-300 text-sm">Analyses d'usage, développement de nouvelles fonctionnalités</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl">📧</div>
                        <div>
                            <h4 class="font-bold text-white mb-2">Communication</h4>
                            <p class="text-gray-300 text-sm">Notifications importantes, mises à jour, support</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 class="font-bold text-purple-300 mb-2">Base Légale du Traitement</h4>
                    <p class="text-purple-200 text-sm">
                        Nous traitons vos données sur la base de : l'exécution du contrat (service de jeu), 
                        votre consentement (newsletters) et nos intérêts légitimes (amélioration du service).
                    </p>
                </div>
            `
        },
        'data-sharing': {
            title: "🤝 Partage des Données",
            content: `
                <p class="mb-4">Nous ne vendons jamais vos données personnelles. Le partage est limité aux cas suivants :</p>

                <div class="space-y-4 mb-6">
                    <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <h4 class="font-bold text-yellow-300 mb-2">Fournisseurs de Services</h4>
                        <p class="text-yellow-200 text-sm">
                            Hébergeurs, services de paiement, outils d'analyse. Tous nos partenaires sont conformes RGPD.
                        </p>
                    </div>

                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h4 class="font-bold text-blue-300 mb-2">Obligations Légales</h4>
                        <p class="text-blue-200 text-sm">
                            Réponse aux requêtes légales des autorités compétentes.
                        </p>
                    </div>

                    <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <h4 class="font-bold text-green-300 mb-2">Protection des Droits</h4>
                        <p class="text-green-200 text-sm">
                            En cas de violation de nos conditions d'utilisation.
                        </p>
                    </div>
                </div>

                <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-red-300 mb-2">🚫 Ce Que Nous Ne Faisons Pas</h4>
                    <ul class="list-disc list-inside space-y-1 text-red-200 text-sm">
                        <li>Vendre vos données à des tiers</li>
                        <li>Partager vos données avec des annonceurs sans consentement</li>
                        <li>Utiliser vos données pour du ciblage publicitaire abusif</li>
                    </ul>
                </div>
            `
        },
        security: {
            title: "🛡️ Sécurité des Données",
            content: `
                <p class="mb-4">Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div class="text-2xl mb-2">🔐</div>
                        <h4 class="font-bold text-green-300 mb-2">Chiffrement</h4>
                        <p class="text-green-200 text-sm">SSL/TLS pour toutes les communications</p>
                    </div>
                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <div class="text-2xl mb-2">🏰</div>
                        <h4 class="font-bold text-blue-300 mb-2">Hébergement Sécurisé</h4>
                        <p class="text-blue-200 text-sm">Serveurs conformes aux normes de sécurité</p>
                    </div>
                    <div class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <div class="text-2xl mb-2">👁️</div>
                        <h4 class="font-bold text-purple-300 mb-2">Accès Restreint</h4>
                        <p class="text-purple-200 text-sm">Accès limité aux données sensibles</p>
                    </div>
                    <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <div class="text-2xl mb-2">📊</div>
                        <h4 class="font-bold text-yellow-300 mb-2">Audits Réguliers</h4>
                        <p class="text-yellow-200 text-sm">Contrôles de sécurité périodiques</p>
                    </div>
                </div>

                <div class="bg-base-200/30 rounded-xl p-4 border border-white/10">
                    <h4 class="font-bold text-white mb-2">Votre Rôle dans la Sécurité</h4>
                    <p class="text-gray-300 text-sm">
                        Protégez votre compte avec un mot de passe fort et ne partagez jamais vos identifiants.
                    </p>
                </div>
            `
        },
        rights: {
            title: "⚖️ Vos Droits RGPD",
            content: `
                <p class="mb-6">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>

                <div class="space-y-4 mb-6">
                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-blue-400">👁️</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit d'accès</h4>
                            <p class="text-gray-300 text-sm">Obtenir une copie de vos données personnelles</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-green-400">✏️</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit de rectification</h4>
                            <p class="text-gray-300 text-sm">Corriger des données inexactes</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-red-400">🗑️</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit à l'effacement</h4>
                            <p class="text-gray-300 text-sm">Supprimer vos données ("droit à l'oubli")</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-yellow-400">⏸️</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit à la limitation</h4>
                            <p class="text-gray-300 text-sm">Restreindre le traitement de vos données</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-purple-400">📤</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit à la portabilité</h4>
                            <p class="text-gray-300 text-sm">Recevoir vos données dans un format structuré</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-base-200/30 rounded-xl border border-white/10">
                        <div class="text-2xl text-orange-400">🚫</div>
                        <div>
                            <h4 class="font-bold text-white mb-1">Droit d'opposition</h4>
                            <p class="text-gray-300 text-sm">Vous opposer au traitement de vos données</p>
                        </div>
                    </div>
                </div>

                <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <h4 class="font-bold text-green-300 mb-2">Comment Exercer Vos Droits</h4>
                    <p class="text-green-200 text-sm">
                        Contactez notre DPO à l'adresse <strong>dpo@loupgarou-online.fr</strong>. 
                        Nous répondons sous 30 jours maximum.
                    </p>
                </div>
            `
        },
        contact: {
            title: "📮 Contact & DPO",
            content: `
                <div class="space-y-6">
                    <div class="p-6 bg-base-200/30 rounded-2xl border border-white/10">
                        <h4 class="text-xl font-bold text-white mb-4">👨‍💼 Délégué à la Protection des Données (DPO)</h4>
                        <div class="space-y-3">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">📧</span>
                                <div>
                                    <div class="text-gray-400 text-sm">Email</div>
                                    <div class="text-white font-semibold">dpo@loupgarou-online.fr</div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">⏰</span>
                                <div>
                                    <div class="text-gray-400 text-sm">Délai de réponse</div>
                                    <div class="text-white font-semibold">Sous 30 jours</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 bg-base-200/30 rounded-2xl border border-white/10">
                        <h4 class="text-xl font-bold text-white mb-4">🏛️ Autorité de Contrôle</h4>
                        <p class="text-gray-300 mb-4">
                            Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL :
                        </p>
                        <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <div class="text-blue-300 font-semibold">Commission Nationale de l'Informatique et des Libertés</div>
                            <div class="text-blue-200 text-sm mt-1">3 Place de Fontenoy, 75007 Paris</div>
                            <div class="text-blue-200 text-sm">+33 1 53 73 22 22</div>
                        </div>
                    </div>

                    <div class="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                        <h4 class="text-xl font-bold text-white mb-4">📝 Modifications de la Politique</h4>
                        <p class="text-gray-300">
                            Nous pouvons mettre à jour cette politique pour refléter les changements légaux ou nos pratiques. 
                            Les modifications importantes vous seront notifiées par email.
                        </p>
                        <div class="mt-3 text-sm text-purple-300">
                            <strong>Dernière mise à jour : 15 Décembre 2024</strong>
                        </div>
                    </div>
                </div>
            `
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        🛡️ Politique de Confidentialité
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Transparence et protection de vos données personnelles
                    </p>
                    <div className="mt-4 text-gray-400">
                        Dernière mise à jour : {content.introduction.lastUpdated}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
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
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{section.icon}</span>
                                            <span className="font-medium">{section.title}</span>
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button className="w-full btn btn-outline btn-primary">
                                    📥 Télécharger en PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white">
                                    {content[activeSection].icon} {content[activeSection].title}
                                </h2>
                                <div className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                                    RGPD Compliant
                                </div>
                            </div>

                            <div
                                className="prose prose-invert max-w-none"
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
                                        disabled={activeSection === 'introduction'}
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
                                        }}
                                        disabled={activeSection === 'contact'}
                                    >
                                        Section suivante →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">
                                ✅ Vous avez des questions ?
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Notre équice de protection des données est là pour vous aider
                            </p>
                            <Link href="/contact" className="btn btn-primary">
                                📧 Contacter notre DPO
                            </Link>
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

export default PrivacyPage;