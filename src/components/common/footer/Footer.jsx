"use client";
import Link from 'next/link';
import {useState} from "react";
import packageJson from '../../../../package.json';

export default function Footer() {

    const [theme, setTheme] = useState('dark');

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : 'dark');
    };

    const version = packageJson?.version || '0.0.0';

    return (
        <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <nav aria-label="Navigation principale" className="flex flex-col items-start space-y-2">
                        <h2 className="footer-title">Navigation</h2>
                        <ul className="space-y-1 flex flex-col items-start">
                            <li><Link href="/" className="link link-hover">Accueil</Link></li>
                            <li><Link href="/rules" className="link link-hover">Règles du jeu</Link></li>
                            <li><Link href="/game/list" className="link link-hover">Liste des parties</Link></li>
                            <li><Link href="/game/create" className="link link-hover">Créer une partie</Link></li>
                        </ul>
                    </nav>

                    <nav aria-label="Aide" className="flex flex-col items-start space-y-2">
                        <h2 className="footer-title">Aide</h2>
                        <ul className="space-y-1 flex flex-col items-start">
                            <li><Link href="/faq" className="link link-hover">FAQ</Link></li>
                            <li><Link href="/support" className="link link-hover">Support</Link></li>
                            <li><Link href="/contact" className="link link-hover">Contact</Link></li>
                        </ul>
                    </nav>

                    <section aria-label="Légal" className="flex flex-col items-start space-y-2">
                        <h2 className="footer-title">Légal</h2>
                        <ul className="space-y-1 flex flex-col items-start">
                            <li><Link href="/privacy" className="link link-hover">Confidentialité</Link></li>
                            <li><Link href="/terms" className="link link-hover">Conditions d'utilisation</Link></li>
                        </ul>
                    </section>

                    <section aria-label="Communauté" className="flex flex-col items-start">
                        <h2 className="footer-title">Communauté</h2>
                        <div className="flex flex-col space-y-2">
                            <Link className="link link-hover" href={process.env.NEXT_PUBLIC_DISCORD_URL || ''}
                                  target="_blank" rel="noopener">Discord</Link>
                            <Link className="link link-hover" href={process.env.NEXT_PUBLIC_GITHUB_URL || ''}
                                  target="_blank" rel="noopener">GitHub</Link>
                        </div>
                    </section>
                </div>

                <div className="divider"></div>

                <div className="flex flex-col md:flex-row justify-between items-center w-full">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="text-2xl">🐺</span>
                        <p className="text-lg font-bold">Loup-Garou Online</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="btn btn-ghost btn-sm">Français</button>
                        <button className="btn btn-ghost btn-sm" onClick={handleThemeToggle}>
                            Thème
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <p>Copyright © {new Date().getFullYear()} - Tous droits réservés</p>
                        <p className="opacity-70">v{version}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}