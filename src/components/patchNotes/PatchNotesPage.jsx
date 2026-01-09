"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {
    AlertTriangle,
    ArrowRight,
    Bug,
    Clock,
    Eye,
    Flag,
    Home,
    Moon,
    Scroll,
    Shield,
    Sparkles,
    Sword
} from "lucide-react";
import {getLatestPatchNote, getPatchBadgeClass, PatchNotes} from "@/utils/PatchNotes.js";
import {formatDateTime} from "@/utils/Date.js";

const PatchNotesPage = () => {
    const [selectedFilter, setSelectedFilter] = useState("all");

    const filteredNotes = selectedFilter === "all"
        ? PatchNotes
        : PatchNotes.filter(note => note.type === selectedFilter);

    const latestPatch = getLatestPatchNote();

    const filters = [
        {
            label: "Toutes",
            value: "all",
            icon: Scroll,
            color: "from-gray-600 to-gray-800 dark:from-gray-600 dark:to-gray-800"
        },
        {
            label: "Majeures",
            value: "major",
            icon: Sparkles,
            color: "from-purple-600 to-pink-600 dark:from-purple-600 dark:to-pink-600"
        },
        {
            label: "Fonctionnalités",
            value: "feature",
            icon: Sword,
            color: "from-blue-600 to-cyan-600 dark:from-blue-600 dark:to-cyan-600"
        },
        {
            label: "Corrections",
            value: "fix",
            icon: Shield,
            color: "from-green-600 to-emerald-600 dark:from-green-600 dark:to-emerald-600"
        },
        {
            label: "Balance",
            value: "balance",
            icon: AlertTriangle,
            color: "from-yellow-600 to-orange-600 dark:from-yellow-600 dark:to-orange-600"
        },
        {
            label: "Launch",
            value: "launch",
            icon: Flag,
            color: "from-gray-600 to-gray-800 dark:from-white/30 dark:to-white/10"
        },
        {
            label: "Hotfix",
            value: "hotfix",
            icon: Bug,
            color: "from-red-600 to-rose-600 dark:from-red-600 dark:to-rose-600"
        },
    ];

    const getIconComponent = (type, size = "md") => {
        const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
        const props = {className: iconSize};

        switch (type) {
            case "feature":
                return <Sword {...props} />;
            case "fix":
                return <Shield {...props} />;
            case "balance":
                return <AlertTriangle {...props} />;
            case "hotfix":
                return <Bug {...props} />;
            case "major":
                return <Sparkles {...props} />;
            case "launch":
                return <Flag {...props} />;
            default:
                return <Scroll {...props} />;
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
            <div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/5 via-transparent to-transparent rounded-full blur-3xl dark:block hidden"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="flex items-center gap-2 text-sm mb-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <Home className="w-4 h-4"/>
                        Accueil
                    </Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="text-gray-800 dark:text-gray-300">Chronique des Mises à Jour</span>
                </div>

                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-3 h-3 bg-red-600 dark:bg-red-500 rounded-full animate-pulse"></div>
                                <span
                                    className="text-sm font-mono text-red-600 dark:text-red-400 tracking-widest uppercase">
                                  La Nuit Évolue...
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                                Chronique des Mises à Jour
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
                                Suivez l&apos;évolution de notre monde nocturne. Chaque mise à jour façonne les nuits à
                                venir.
                            </p>
                        </div>

                        <Link
                            href="https://github.com/achedon12/werewolf/issues"
                            target="_blank"
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all"
                        >
                            <Bug
                                className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"/>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">Signaler un bug</div>
                                <div
                                    className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400">Alerte
                                    les gardiens
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <Clock className="w-4 h-4 text-red-600 dark:text-red-400"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-gray-900 dark:text-white">{PatchNotes.length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Mises à jour</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                    <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-gray-900 dark:text-white">{PatchNotes.filter(n => n.type === 'major').length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Majeures</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Sword className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-gray-900 dark:text-white">{PatchNotes.filter(n => n.type === 'feature').length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Fonctionnalités</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-gray-900 dark:text-white">{PatchNotes.filter(n => n.type === 'fix').length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Corrections</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filtrer par type</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value)}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    selectedFilter === filter.value
                                        ? `bg-gradient-to-r ${filter.color} border-transparent text-white shadow-lg`
                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-300"
                                }`}
                            >
                                <filter.icon className={`w-4 h-4 ${
                                    selectedFilter === filter.value
                                        ? 'text-white'
                                        : 'text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                                }`}/>
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {latestPatch && selectedFilter === "all" && (
                    <div className="mb-12">
                        <div className="relative group">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div
                                className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 dark:hover:border-red-500 transition-all duration-300">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-2/5 relative min-h-64 lg:min-h-80">
                                        {latestPatch.image ? (
                                            <>
                                                <Image
                                                    src={latestPatch.image}
                                                    alt={latestPatch.title}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/50 lg:to-transparent dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent dark:lg:from-gray-900 dark:lg:via-gray-900/50 dark:lg:to-transparent"></div>
                                            </>
                                        ) : (
                                            <div
                                                className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-100 dark:from-red-900/20 dark:to-gray-900 flex items-center justify-center">
                                                <div className="text-red-600/20 dark:text-red-600/20 text-6xl">
                                                    {getIconComponent(latestPatch.type, "lg")}
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div
                                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                <Moon className="w-3 h-3"/>
                                                Dernière nuit
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-3/5 p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="text-3xl font-mono font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                                                {latestPatch.version}
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPatchBadgeClass(latestPatch.type)}`}>
                                                {latestPatch.type === "major" ? "Majeure" :
                                                    latestPatch.type === "feature" ? "Fonctionnalité" :
                                                        latestPatch.type === "fix" ? "Correction" :
                                                            latestPatch.type === "balance" ? "Balance" :
                                                                latestPatch.type === "hotfix" ? "Hotfix" : "Lancement"}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                                            {latestPatch.title}
                                        </h3>

                                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                                            {latestPatch.description || latestPatch.changes[0]?.changes[0]?.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <Link
                                                href={`/patch-notes/${latestPatch.version}`}
                                                className="group/btn flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                                            >
                                                <span>Explorer la nuit</span>
                                                <ArrowRight
                                                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"/>
                                            </Link>
                                            <div
                                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                                <Clock className="w-4 h-4"/>
                                                {formatDateTime(latestPatch.date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Scroll className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chronologie des Nuits</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          ({filteredNotes.length} mise{filteredNotes.length !== 1 ? 's' : ''} à jour)
                        </span>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <div
                            className="text-center py-16 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                                <Eye className="w-16 h-16"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucune trace</h3>
                            <p className="text-gray-600 dark:text-gray-400">Aucune mise à jour ne correspond à ce
                                filtre.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredNotes.map((patch) => (
                                <Link
                                    key={patch.version}
                                    href={`/patch-notes/${patch.version}`}
                                    className="group relative overflow-hidden"
                                >
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div
                                        className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all hover:shadow-xl hover:shadow-red-500/10 dark:hover:shadow-red-500/10">
                                        <div className="md:w-32 flex-shrink-0">
                                            <div className="flex md:flex-col items-start gap-3">
                                                <div
                                                    className="text-xl font-mono font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                                                    {patch.version}
                                                </div>
                                                <div
                                                    className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPatchBadgeClass(patch.type)}`}>
                                                    {patch.type === "major" ? "Majeure" :
                                                        patch.type === "feature" ? "Feature" :
                                                            patch.type === "fix" ? "Fix" :
                                                                patch.type === "balance" ? "Balance" :
                                                                    patch.type === "hotfix" ? "Hotfix" : "Launch"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div
                                                className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                                                        {patch.title}
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                        {patch.description || patch.changes[0]?.changes[0]?.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                                                        <Clock className="w-4 h-4"/>
                                                        {formatDateTime(patch.date)}
                                                    </div>
                                                    <ArrowRight
                                                        className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-2 transition-all"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatchNotesPage;