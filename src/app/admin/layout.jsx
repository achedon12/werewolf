'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {BarChart3, Gamepad2, LayoutDashboard, LogOut, Menu, Settings, Shield, Users, X, Home} from 'lucide-react';
import {useAuth} from "@/app/AuthProvider.jsx";

const NavItem = ({href, icon: Icon, label, onClick, active, mobile = false}) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            active
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        } ${mobile ? 'text-base' : ''}`}
    >
        <Icon className="h-5 w-5 flex-shrink-0"/>
        <span className="font-medium">{label}</span>
    </Link>
);

const AdminLayout = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const {user, token, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!user || !token || (user.role !== 'admin' && user.role !== 'moderator')) {
            router.push('/auth');
        }
    }, [loading, user, token, router]);

    const menuItems = [
        {href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'},
        {href: '/admin/users', icon: Users, label: 'Utilisateurs'},
        {href: '/admin/games', icon: Gamepad2, label: 'Parties'},
        {href: '/admin/analytics', icon: BarChart3, label: 'Analytics'},
        {href: '/admin/newsletter', icon: Shield, label: 'Newsletter'},
        {href: '/admin/settings', icon: Settings, label: 'Paramètres'},
    ];

    const handleLogout = () => {
        router.push('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div
                    className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div
                            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                            <Shield className="h-6 w-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Panel de contrôle</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <NavItem key={item.href} {...item} active={pathname === item.href}/>
                        ))}
                    </nav>

                    <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={user?.avatar || '/default-avatar.png'}
                                    alt={user?.nickname || 'Utilisateur'}
                                    className="rounded-full object-cover w-full h-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.nickname || 'Utilisateur'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
                        <div className="flex flex-col flex-1 h-full">
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                                        <Shield className="h-6 w-6 text-white"/>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Panel de contrôle</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                                </button>
                            </div>

                            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => (
                                    <NavItem
                                        key={item.href}
                                        {...item}
                                        active={pathname === item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        mobile={true}
                                    />
                                ))}
                            </nav>

                            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src={user?.avatar || '/default-avatar.png'}
                                            alt={user?.nickname || 'Utilisateur'}
                                            className="rounded-full object-cover w-full h-full"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user?.nickname || 'Utilisateur'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <Link
                                        href="/"
                                        className="btn btn-ghost btn-sm flex items-center gap-2 justify-center text-gray-600 dark:text-gray-300"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Home className="h-4 w-4"/>
                                        Accueil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-ghost btn-sm flex items-center gap-2 justify-center text-gray-600 dark:text-gray-300"
                                    >
                                        <LogOut className="h-4 w-4"/>
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                            </button>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                                    Administration
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                    {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="lg:hidden btn btn-ghost btn-sm flex items-center gap-1 p-2"
                                title="Retour à l'accueil"
                            >
                                <Home className="h-4 w-4"/>
                            </Link>

                            <div className="hidden sm:flex">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-ghost btn-sm flex items-center gap-2 text-gray-600 dark:text-gray-300"
                                >
                                    <LogOut className="h-4 w-4"/>
                                    <span className="hidden md:inline">Déconnexion</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 sm:hidden">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src={user?.avatar || '/default-avatar.png'}
                                        alt={user?.nickname || 'Utilisateur'}
                                        className="rounded-full object-cover w-full h-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
                    <div className="max-w-full">
                        {children}
                    </div>
                </main>
            </div>

            {isMobile && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="flex justify-around items-center p-2">
                        {menuItems.slice(0, 4).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center p-2 rounded-lg min-w-0 flex-1 mx-1 ${
                                    pathname === item.href
                                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <item.icon className="h-5 w-5 mb-1"/>
                                <span className="text-xs truncate max-w-full text-center px-1">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex flex-col items-center p-2 rounded-lg min-w-0 flex-1 mx-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Menu className="h-5 w-5 mb-1"/>
                            <span className="text-xs">Plus</span>
                        </button>
                    </div>
                </div>
            )}

            {isMobile && (
                <div className="pb-16 lg:pb-0"></div>
            )}
        </div>
    );
};

export default AdminLayout;