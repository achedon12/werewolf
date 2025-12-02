"use client";
import Link from 'next/link';
import {useEffect, useState} from 'react';
import packageJson from '../../../../package.json';
import {usePathname} from 'next/navigation';
import {Github, Globe, Heart, HelpCircle, Home, MessageCircle, Moon, Shield, Sun} from 'lucide-react';

export default function Footer() {
    const [theme, setTheme] = useState('dark');
    const pathname = usePathname();

    useEffect(() => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(currentTheme);
    }, []);

    if (pathname?.startsWith('/admin')) return null;

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('theme', newTheme);
    };

    const version = packageJson?.version || '0.0.0';
    const author = packageJson?.author || 'Unknown';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                <span className="text-2xl">🐺</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loup-Garou Online</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Le jeu de société mythique en
                                    ligne</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                            Jouez au célèbre jeu du Loup-Garou avec des amis du monde entier.
                            Stratégie, mensonge et déduction au rendez-vous !
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={process.env.NEXT_PUBLIC_DISCORD_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Rejoindre notre Discord"
                            >
                                <MessageCircle className="w-5 h-5"/>
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Voir notre code source sur GitHub"
                            >
                                <Github className="w-5 h-5"/>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Home className="w-4 h-4"/>
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/rules"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Règles du jeu
                                </Link>
                            </li>
                            <li>
                                <Link href="/game/list"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Parties disponibles
                                </Link>
                            </li>
                            <li>
                                <Link href="/game/create"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Créer une partie
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Classement
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4"/>
                            Aide
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/support"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4"/>
                            Légal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Conditions d'utilisation
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies"
                                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <span
                                        className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
                                    Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mb-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © {currentYear} Loup-Garou Online. Tous droits réservés.
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                            Version {version} • Fait avec <Heart className="inline w-3 h-3 text-red-500"/> par
                            <a
                                className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                                href="https://leoderoin.fr" target="_blank"
                            >
                                {author.split(' <')[0]}</a>.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleThemeToggle}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={`Passer au thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun className="w-4 h-4"/>
                                    <span className="text-sm">Mode clair</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4"/>
                                    <span className="text-sm">Mode sombre</span>
                                </>
                            )}
                        </button>

                        <div className="relative group">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <Globe className="w-4 h-4"/>
                                <span className="text-sm">Français</span>
                                <span className="text-xs opacity-60">▼</span>
                            </button>
                            <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block">
                                <div
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[120px]">
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                        🇫🇷 Français
                                    </button>
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                        🇬🇧 English
                                    </button>
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                        🇪🇸 Español
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <span>🔒 Connexion sécurisée</span>
                            <span>•</span>
                            <span>🚀 Performance optimisée</span>
                            <span>•</span>
                            <span>📱 Compatible mobile</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-right">
                            <p>
                                Loup-Garou Online n'est pas affilié à "Les Loups-garous de Thiercelieux" •
                                Jeu créé par Philippe des Pallières et Hervé Marly
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}