import {useEffect, useRef, useState} from "react";

const StartingCounter = ({startingSoon, currentPlayer}) => {
    const [showRole, setShowRole] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (startingSoon === 4) {
            try {
                const audio = new Audio('/sounds/riser.mp3');
                audio.volume = 1;
                audioRef.current = audio;
                audio.play();
            } catch (error) {}
        }

        if (startingSoon === 1 && audioRef.current) {
            const fadeOut = setInterval(() => {
                if (audioRef.current.volume > 0.05) {
                    audioRef.current.volume -= 0.05;
                } else {
                    audioRef.current.volume = 0;
                    audioRef.current.pause();
                    clearInterval(fadeOut);
                }
            }, 50);
            return () => clearInterval(fadeOut);
        }

        if (startingSoon === 0) {
            setShowRole(true);
            const timer = setTimeout(() => setShowRole(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowRole(false);
        }
    }, [startingSoon]);

    if (!startingSoon && !showRole) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center p-8 bg-base-300/90 rounded-3xl border border-white/20 shadow-2xl">
                {showRole && currentPlayer && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-6xl font-bold text-primary drop-shadow-lg mb-4">
                            Votre rôle :
                        </div>
                        <div className="text-5xl font-bold text-white animate-pulse">
                            {currentPlayer.role}
                        </div>
                    </div>
                )}

                {!showRole && (
                    <>
                        {startingSoon === 10 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-6xl font-bold text-white drop-shadow-lg mb-4">
                                    🎮 La partie commence bientôt !
                                </div>
                                <div className="text-4xl font-bold text-primary animate-pulse">
                                    Préparez-vous...
                                </div>
                            </div>
                        )}

                        {startingSoon <= 5 && startingSoon > 0 && (
                            <div className="space-y-6 animate-scale-in">
                                <div className="text-9xl font-extrabold text-primary drop-shadow-lg animate-bounce">
                                    {startingSoon}
                                </div>
                                <div className="text-2xl text-white font-semibold animate-pulse">
                                    {startingSoon === 1 ? "C'est parti !" : "Attention..."}
                                </div>
                            </div>
                        )}

                        {startingSoon > 5 && startingSoon < 10 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="text-5xl font-bold text-white drop-shadow-lg">
                                    La partie commence dans
                                </div>
                                <div className="text-6xl font-bold text-yellow-400 animate-pulse">
                                    {startingSoon}s
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-primary rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StartingCounter;