'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {BarChart3, Gamepad2, LayoutDashboard, LogOut, Menu, Settings, Shield, Users, X} from 'lucide-react';
import {useAuth} from "@/app/AuthProvider.jsx";

const NavItem = ({href, icon: Icon, label, onClick, active}) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            active
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
    >
        <Icon className="h-5 w-5"/>
        <span className="font-medium">{label}</span>
    </Link>
);

const AdminLayout = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const {user, token, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user || !token || user.role !== 'admin') {
            router.push('/auth');
        }
    }, [loading, user, token, router]);

    const menuItems = [
        {href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'},
        {href: '/admin/users', icon: Users, label: 'Utilisateurs'},
        {href: '/admin/games', icon: Gamepad2, label: 'Parties'},
        {href: '/admin/analytics', icon: BarChart3, label: 'Analytics'},
        {href: '/admin/settings', icon: Settings, label: 'Paramètres'},
    ];

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
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                                <img src={user?.avatar || '/default-avatar.png'} alt={user?.avatar || 'default avatar'}
                                     className="rounded-full object-cover w-full h-full"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.nickname || 'Utilisateur'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {sidebarOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
                         onClick={() => setSidebarOpen(false)}/>
                    <div
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
                        <div className="flex flex-col flex-1 min-h-0">
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                                        <Shield className="h-6 w-6 text-white"/>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h1>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="h-5 w-5"/>
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-2">
                                {menuItems.map((item) => (
                                    <NavItem
                                        key={item.href}
                                        {...item}
                                        active={pathname === item.href}
                                        onClick={() => setSidebarOpen(false)}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:pl-64">
                <div
                    className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Menu className="h-5 w-5"/>
                            </button>
                            <h1 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                                Administration
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/auth/profile/overview" className="btn btn-ghost flex items-center gap-2">
                                <LogOut className="h-4 w-4"/>
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </div>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;