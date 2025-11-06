'use client';
import Link from 'next/link';
import {Gamepad2} from 'lucide-react';

const PlayButton = ({href = '/game/list', label = 'Jouer', subtitle = 'Créer une partie'}) => {
    return (
        <div className="relative group">
            <div
                className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-orange-400/20 rounded-full blur-xl group-hover:from-purple-600/30 group-hover:via-pink-500/30 group-hover:to-orange-400/30 transition-all duration-500 animate-pulse"></div>

            <Link
                href={href}
                aria-label={label}
                className="relative inline-flex items-center gap-4 md:gap-6 px-4 py-2 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold md:font-bold shadow-lg md:shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300/50 ring-offset-2 ring-offset-purple-900 border border-white/8 hover:border-white/20 backdrop-blur-sm"
            >
                    <span
                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/12 backdrop-blur-md shadow-md group-hover:bg-white/20 transition-colors duration-300">
                      <Gamepad2 className="h-5 w-5 md:h-6 md:w-6 text-white animate-[bounce_2s_ease-in-out_infinite]"/>
                    </span>

                <span className="text-left">
                      <span className="block text-sm md:text-xl leading-tight tracking-wide">{label}</span>
                      <span
                          className="block text-[11px] md:text-sm text-white/90 font-medium mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {subtitle}
                      </span>
                    </span>

                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
            </Link>
        </div>
    );
};

export default PlayButton;