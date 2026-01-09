"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Moon,
    Sword,
    Shield,
    Scroll,
    Bug,
    Sparkles,
    Flag,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    Home,
    Eye,
    Zap,
    Users
} from "lucide-react";
import { formatDateTime } from "@/utils/Date.js";
import { getPatchBadgeClass, PatchNotes } from "@/utils/PatchNotes.js";

const PatchNotesDetailPage = ({ params }) => {
    const { version } = use(params);

    const patch = PatchNotes.find(p => p.version === version);
    const currentIndex = PatchNotes.findIndex(p => p.version === version);
    const previousPatch = currentIndex < PatchNotes.length - 1 ? PatchNotes[currentIndex + 1] : null;
    const nextPatch = currentIndex > 0 ? PatchNotes[currentIndex - 1] : null;

    const getIconComponent = (type, size = "md") => {
        const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
        const props = { className: iconSize };

        switch (type) {
            case "feature": return <Sword {...props} />;
            case "fix": return <Shield {...props} />;
            case "balance": return <AlertTriangle {...props} />;
            case "hotfix": return <Bug {...props} />;
            case "major": return <Sparkles {...props} />;
            case "launch": return <Flag {...props} />;
            default: return <Scroll {...props} />;
        }
    };

    if (!patch) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-6xl mb-6">🌕</div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Patch note introuvable</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Cette mise à jour nocturne n&apos;existe pas.</p>
                    <Link
                        href="/patch-notes"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux Chroniques
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/5 via-transparent to-transparent rounded-full blur-3xl dark:block hidden"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="flex items-center gap-2 text-sm mb-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Accueil
                    </Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <Link
                        href="/patch-notes"
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        Chronique des Mises à Jour
                    </Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="text-gray-800 dark:text-gray-300 truncate max-w-xs">{patch.version}</span>
                </div>

                <div className="relative mb-12">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-red-600/10 to-orange-600/10 rounded-full blur-xl dark:block hidden"></div>

                    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg dark:shadow-none">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-xl ${getPatchBadgeClass(patch.type)}`}>
                                        {getIconComponent(patch.type)}
                                    </div>
                                    <div>
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPatchBadgeClass(patch.type)}`}>
                      {patch.type === "major" ? "Mise à Jour Majeure" :
                          patch.type === "feature" ? "Nouvelle Fonctionnalité" :
                              patch.type === "fix" ? "Correction" :
                                  patch.type === "balance" ? "Équilibrage" :
                                      patch.type === "hotfix" ? "Correction Rapide" : "Lancement"}
                    </span>
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {patch.title}
                                </h1>

                                <div className="text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-4">
                                    {patch.version}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDateTime(patch.date)}
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Version {patch.buildId || "1.0"}
                                    </div>
                                </div>
                            </div>

                            {patch.image && (
                                <div className="relative w-full lg:w-1/3 h-48 lg:h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <Image
                                        src={patch.image}
                                        alt={patch.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-900"></div>
                                </div>
                            )}
                        </div>

                        {patch.description && (
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 pl-6 leading-relaxed">
                                    {patch.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {patch.featured && (
                    <div className="mb-8 relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-red-950/30 p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl dark:block hidden"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-orange-600">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">⚠️ Attention Loups et Villageois</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Cette nuit apporte des changements majeurs qui pourraient altérer vos stratégies.
                                    Lisez attentivement avant de chasser.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3 mb-4 text-gray-900 dark:text-white">
                            <Moon className="w-6 h-6 text-red-600 dark:text-red-400" />
                            Les Changements de la Nuit
                            <Moon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez les évolutions et ajustements qui façonnent vos nuits
                        </p>
                    </div>

                    {patch.changes.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="relative">
                            <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-orange-500 to-transparent"></div>

                            <div className="flex gap-6">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg">
                                        <div className="text-red-600 dark:text-red-400">
                                            {getIconComponent(sectionIndex === 0 ? patch.type : 'feature', 'md')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 pb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-red-600 dark:border-red-500 pb-2">
                                            {section.category}
                                        </h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {section.changes.length} changement{section.changes.length > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {section.changes.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="group relative overflow-hidden"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="flex gap-4 p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-500/10">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center">
                                                            <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {item.description}
                                                        </p>

                                                        {item.details && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                                    {item.details}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {previousPatch ? (
                            <Link
                                href={`/patch-notes/${previousPatch.version}`}
                                className="group flex-1"
                            >
                                <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-500/10">
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-red-600 group-hover:to-orange-600 transition-all">
                                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Nuit précédente
                                        </div>
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors truncate">
                                            {previousPatch.version}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {previousPatch.title}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex-1"></div>
                        )}

                        <div className="flex items-center justify-center">
                            <Link
                                href="/patch-notes"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-300 transition-all"
                            >
                                <Scroll className="w-4 h-4" />
                                Toutes les chroniques
                            </Link>
                        </div>

                        {nextPatch ? (
                            <Link
                                href={`/patch-notes/${nextPatch.version}`}
                                className="group flex-1"
                            >
                                <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-500/10 text-right">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Nuit suivante
                                        </div>
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors truncate">
                                            {nextPatch.version}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {nextPatch.title}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-red-600 group-hover:to-orange-600 transition-all">
                                        <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex-1"></div>
                        )}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Impact</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400">
                            {patch.type === 'major' ? 'Changements majeurs affectant toutes les parties' :
                                patch.type === 'feature' ? 'Nouvelles fonctionnalités pour enrichir le jeu' :
                                    patch.type === 'fix' ? 'Améliorations de stabilité et corrections' :
                                        patch.type === 'balance' ? 'Ajustements pour équilibrer les rôles' :
                                            'Maintenance et optimisations'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Recommandations</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400">
                            {patch.featured ?
                                'Recommandé de lire attentivement avant votre prochaine partie' :
                                'Prenez connaissance des changements pour adapter vos stratégies'
                            }
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Statut</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400">
                            Actuellement déployé sur tous les serveurs.
                            {patch.type === 'hotfix' ? ' Installation urgente recommandée.' : ' Jouable immédiatement.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatchNotesDetailPage;