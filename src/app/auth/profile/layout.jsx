"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import {ChartColumnBig, Gamepad2, LayoutDashboard, Settings, Users} from "lucide-react";

const TABS = [
    { key: "overview", label: "Vue d'ensemble", icon: <LayoutDashboard /> },
    { key: "game", label: "Parties", icon: <Gamepad2 /> },
    { key: "friends", label: "Amis", icon: <Users /> },
    { key: "settings", label: "Paramètres", icon: <Settings /> },
    { key: "stats", label: "Statistiques", icon: <ChartColumnBig /> }
];

const ProfileLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, token, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (loading) return;
        if ((!user || !token) && pathname !== '/auth') {
            router.push('/auth');
        }
    }, [user, token, loading, router, pathname]);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        if(tabKey === 'game') {
            router.push('/auth/profile/game/list');
            return;
        }
        router.push(`/auth/profile/${tabKey}`);
    };

    useEffect(() => {
        if(!pathname) return;

        if (pathname.endsWith("/game/list")) {
            setActiveTab("game");
            return;
        }

        const currentTab = pathname.split('/').pop();
        if (TABS.some(tab => tab.key === currentTab)) {
            setActiveTab(currentTab);
        }
    }, [pathname]);

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
                    <div className="tabs tabs-boxed bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 rounded-lg shadow-md">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`tab flex items-center justify-start md:justify-center space-x-2 w-full md:w-auto ${
                                    activeTab === tab.key
                                        ? 'tab-active text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                                }`}
                                onClick={() => handleTabChange(tab.key)}
                                type="button"
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                        {(user && (user.role === 'admin' || user.role === 'moderator')) && (
                            <button
                                className="tab flex items-center justify-start md:justify-center space-x-2 w-full md:w-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600"
                                onClick={() => router.push('/admin/dashboard')}
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.03a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.42-1.42l.71-.7zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zm-2.03 4.22a1 1 0 11-1.42 1.42l-.7-.71a1 1 0 111.42-1.42l.7.71zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.03a1 1 0 00-1.42 1.42l.71.7a1 1 0 101.42-1.42l-.71-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.03-4.22a1 1 0 101.42-1.42l.7.71a1 1 0 11-1.42 1.42l-.7-.71z" />
                                    <path d="M10 5a5 5 0 100 10 5 5 0 000-10zM2 10a8 8 0 1116 0A8 8 0 012 10z" />
                                </svg>
                                Admin Dashboard
                            </button>
                        )}
                    </div>
                </div>

                <div className="animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;