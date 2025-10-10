"use client";
import Link from 'next/link';
import {useState} from "react";

export default function Footer() {

    const [theme, setTheme] = useState('dark');

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : 'dark');
    };

    return (
        <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="flex flex-col items-start space-y-2">
                        <h3 className="footer-title">Navigation</h3>
                        <Link href="/" className="link link-hover">Accueil</Link>
                        <Link href="/rules" className="link link-hover">Règles du jeu</Link>
                        <Link href="/game/list" className="link link-hover">Liste des parties</Link>
                        <Link href="/game/create" className="link link-hover">Créer une partie</Link>
                    </div>

                    <div className="flex flex-col items-start space-y-2">
                        <h3 className="footer-title">Aide</h3>
                        <Link href="/faq" className="link link-hover">FAQ</Link>
                        <Link href="/support" className="link link-hover">Support</Link>
                        <Link href="/contact" className="link link-hover">Contact</Link>
                    </div>

                    <div className="flex flex-col items-start space-y-2">
                        <h3 className="footer-title">Légal</h3>
                        <Link href="/privacy" className="link link-hover">Confidentialité</Link>
                        <Link href="/terms" className="link link-hover">Conditions d'utilisation</Link>
                    </div>

                    <div className="flex flex-col items-start">
                        <h3 className="footer-title">Communauté</h3>
                        <div className="flex flex-col space-y-2">
                            <Link className="link link-hover" href={process.env.NEXT_PUBLIC_DISCORD_URL || ''} target="_blank">Discord</Link>
                            <Link className="link link-hover" href={process.env.NEXT_PUBLIC_GITHUB_URL || ''} target="_blank">GitHub</Link>
                        </div>
                    </div>
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

                    <div>
                        <p>Copyright © {new Date().getFullYear()} - Tous droits réservés</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}