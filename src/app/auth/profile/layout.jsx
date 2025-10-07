"use client";
import { useEffect } from "react";
import { useAuth } from "../../AuthProvider";
import { useRouter, usePathname } from "next/navigation";

const ProfileLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, token, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if ((!user || !token) && pathname !== '/auth') {
            router.push('/auth');
        }
    }, [user, token, loading, router, pathname]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-purple-300 dark:to-blue-300 dark:text-transparent">
                        Mon Profil
                    </h1>
                    <p className="text-gray-600 mt-2 dark:text-gray-300">
                        Gérez vos informations personnelles et consultez vos statistiques
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="tabs tabs-boxed bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 flex space-x-4 rounded-lg shadow-md pl-2 pr-2">
                        <a className="tab tab-active dark:text-white">📊 Vue d&apos;ensemble</a>
                        <a className="tab dark:text-white">⚙️ Paramètres</a>
                        <a className="tab dark:text-white">📈 Statistiques</a>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}

export default ProfileLayout;
