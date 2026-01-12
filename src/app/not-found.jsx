'use client';

import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';

const NotFound = () => {
    const router = useRouter();
    const canvasRef = useRef(null);
    const moonRef = useRef(null);
    const eyesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const starCount = 200;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.01
            });
        }

        const animateStars = () => {
            stars.forEach(star => {
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.speed = -star.speed;
                }
            });
        };

        const drawTrees = () => {
            ctx.fillStyle = '#1a1a2e';

            for (let i = 0; i < 8; i++) {
                const x = i * 60;
                const height = 200 + Math.random() * 100;
                ctx.beginPath();
                ctx.moveTo(x, canvas.height);
                ctx.lineTo(x - 40, canvas.height - height);
                ctx.lineTo(x + 40, canvas.height - height);
                ctx.closePath();
                ctx.fill();
            }

            for (let i = 0; i < 8; i++) {
                const x = canvas.width - i * 60;
                const height = 200 + Math.random() * 100;
                ctx.beginPath();
                ctx.moveTo(x, canvas.height);
                ctx.lineTo(x - 40, canvas.height - height);
                ctx.lineTo(x + 40, canvas.height - height);
                ctx.closePath();
                ctx.fill();
            }
        };

        const animate = () => {
            ctx.fillStyle = '#0f0f1f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animateStars();
            drawTrees();

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            eyesRef.current.forEach(eye => {
                if (eye) {
                    eye.style.opacity = Math.random() > 0.7 ? '1' : '0.3';
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            <div
                ref={moonRef}
                className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 shadow-2xl shadow-yellow-400/50 animate-pulse"
                style={{
                    animation: 'pulse 3s infinite alternate',
                }}
            >
                <div className="absolute w-8 h-8 bg-gray-800 rounded-full top-4 left-6 opacity-20"></div>
                <div className="absolute w-6 h-6 bg-gray-800 rounded-full top-10 left-16 opacity-30"></div>
                <div className="absolute w-4 h-4 bg-gray-800 rounded-full top-16 left-8 opacity-40"></div>
            </div>

            <div className="absolute bottom-1/4 left-1/4 space-y-8">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        ref={el => eyesRef.current[i] = el}
                        className="flex space-x-4 opacity-30 transition-opacity duration-500"
                    >
                        <div
                            className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                        <div
                            className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4 animate-bounce">
                        4<span className="text-red-500">0</span>4
                    </h1>

                    <div className="w-64 h-16 relative mb-8 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center animate-marquee">
                            <span className="text-6xl">🐺</span>
                            <span className="text-6xl ml-4">🐺</span>
                            <span className="text-6xl ml-4">🐺</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <h2 className="text-3xl font-bold text-white animate-pulse">
                        La Clairière Est Vide...
                    </h2>

                    <p className="text-xl text-gray-300 leading-relaxed">
                        La page que vous cherchez a disparu dans la brume de la forêt.
                        Peut-être que les loups-garous l&apos;ont emportée pendant la nuit...
                    </p>

                    <div className="text-gray-400 text-sm space-y-2">
                        <p>🌕 La pleine lune vous observe...</p>
                        <p>🐺 Les loups rôdent dans l&apos;ombre...</p>
                        <p>🔮 La voyante n&apos;a rien vu venir...</p>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={() => router.push('/')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25"
                    >
                        <span className="relative z-10">🏡 Retourner au Village</span>
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <button
                        onClick={() => router.push('/games')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-600 hover:border-gray-400"
                    >
                        <span className="relative z-10">🎮 Rejoindre une Partie</span>
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>

                <div className="mt-16 p-6 border border-gray-700 rounded-2xl bg-black/20 backdrop-blur-sm max-w-md">
                    <p className="text-gray-400 italic text-sm">
                        &ldquo;Dans la nuit du web, certaines pages se perdent à jamais...
                        Méfiez-vous du loup qui se cache dans l&apos;ombre du code.&rdquo;
                    </p>
                    <p className="text-gray-500 text-xs mt-2">— La Voyante du DNS</p>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/50"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="animate-float-slow">🌫️</div>
                    <div className="animate-float-medium">🌫️</div>
                    <div className="animate-float-fast">🌫️</div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }

                @keyframes float-medium {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-15px) translateX(-15px);
                    }
                }

                @keyframes float-fast {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-10px) translateX(20px);
                    }
                }

                .animate-marquee {
                    animation: marquee 8s linear infinite;
                }

                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                    position: absolute;
                    top: 20%;
                    left: 10%;
                    font-size: 3rem;
                }

                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                    position: absolute;
                    top: 60%;
                    right: 15%;
                    font-size: 2.5rem;
                }

                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                    position: absolute;
                    bottom: 30%;
                    left: 20%;
                    font-size: 2rem;
                }
            `}</style>
        </div>
    );
}

export default NotFound;