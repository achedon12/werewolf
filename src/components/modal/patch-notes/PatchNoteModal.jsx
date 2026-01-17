"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {ArrowRight, Bell, Sparkles, X} from "lucide-react";
import {getLatestPatchNote, getPatchBadgeClass} from "@/utils/PatchNotes";

export default function PatchNoteModal() {
    const [show, setShow] = useState(false);
    const [latestPatch, setLatestPatch] = useState(null);

    useEffect(() => {
        setLatestPatch(getLatestPatchNote());
    }, []);

    useEffect(() => {
        if (!latestPatch) return;

        const lastPatchSeen = localStorage.getItem("lastPatchSeen");

        if (!lastPatchSeen || lastPatchSeen !== latestPatch.version) {
            setTimeout(() => setShow(true), 300);
        }
    }, [latestPatch]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => setShow(false), 300);
    };

    const handleMarkAsRead = () => {
        localStorage.setItem("lastPatchSeen", latestPatch.version);
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div
                className={`relative w-full max-w-md transform transition-all duration-300 ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <div
                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 shadow-2xl">
                    <div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"/>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400"/>
                    </button>

                    <div className="p-6 pt-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-xl opacity-50 animate-pulse"/>
                                <div
                                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white"/>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Bell className="w-4 h-4 text-red-500"/>
                                <span className="text-sm font-medium text-red-500 dark:text-red-400">
                                    Nouvelle mise à jour
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {latestPatch.title}
                            </h2>
                            <div className="flex items-center justify-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getPatchBadgeClass(
                                        latestPatch.type.toUpperCase()
                                    )}`}
                                >
                                    v{latestPatch.version}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(latestPatch.date).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                De nouvelles fonctionnalités et améliorations vous attendent !
                                Découvrez ce qui a changé dans cette mise à jour.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/patch-notes"
                                onClick={handleMarkAsRead}
                                className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                            >
                                Voir les nouveautés
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <button
                                onClick={handleClose}
                                className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                            >
                                Plus tard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}