import {LogIn, LogOut, Settings, UserRound} from "lucide-react";
import {useEffect, useState} from "react";
import {useAuth} from "@/app/AuthProvider.jsx";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ProfileButton = () => {

    const [isClient, setIsClient] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showInfosMenu, setShowInfosMenu] = useState(false);
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu')) {
                setShowUserMenu(false);
            }
            if (showInfosMenu && !event.target.closest('.infos-menu')) {
                setShowInfosMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showUserMenu, showInfosMenu]);

    const handleLogout = () => {
        auth.logout();
        setShowUserMenu(false);
        router.push('/');
    };

    if (!isClient) {
        return <UserRound className="w-5 h-5" suppressHydrationWarning/>;
    }

    if (auth.user) {
        return (
            <div className="flex items-center gap-2 user-menu relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors"
                    aria-label="Ouvrir le menu utilisateur"
                >
                        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                            {auth.user.nickname}
                        </span>
                    <div className="relative">
                        <Image
                            src={auth.user.avatar || '/default-avatar.png'}
                            alt={`${auth.user.name} — avatar`}
                            width={36}
                            height={36}
                            className="rounded-full border-2 border-transparent hover:border-blue-500 transition-colors"
                        />
                        <div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                </button>

                {showUserMenu && (
                    <div
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                        </div>
                        <Link
                            href="/auth/profile"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                        >
                            <UserRound className="w-4 h-4"/>
                            Mon profil
                        </Link>
                        <Link
                            href="/auth/profile/settings"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                        >
                            <Settings className="w-4 h-4"/>
                            Paramètres
                        </Link>
                        {(auth.user && (auth.user.role === 'admin' || auth.user.role === 'moderator')) && (
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Settings className="w-4 h-4"/>
                                Admin Panel
                            </Link>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                            <LogOut className="w-4 h-4"/>
                            Déconnexion
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => router.push('/auth')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            aria-label="Se connecter"
        >
            <LogIn className="w-4 h-4"/>
            <span className="hidden md:inline">Connexion</span>
        </button>
    );
}

export default ProfileButton;