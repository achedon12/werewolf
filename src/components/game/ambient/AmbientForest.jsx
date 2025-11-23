'use client';

import { useEffect, useRef } from 'react';

const AmbientForest = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Brume plus visible
        particlesRef.current = Array.from({ length: 25 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 150 + 80,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.15 + 0.1
        }));

        // Feuilles plus visibles
        const leaves = Array.from({ length: 30 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 12 + 6,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.3,
            swing: Math.random() * Math.PI * 2,
            color: `hsl(${Math.random() * 30 + 100}, 70%, 50%)` // Vert plus visible
        }));

        let animationFrameId;

        const animate = () => {
            // Fond semi-transparent pour mieux voir les animations
            ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Brume plus épaisse
            particlesRef.current.forEach(particle => {
                particle.x += particle.speed;
                if (particle.x > canvas.width + particle.size) {
                    particle.x = -particle.size;
                    particle.y = Math.random() * canvas.height;
                }

                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, `rgba(120, 180, 255, ${particle.opacity})`);
                gradient.addColorStop(0.5, `rgba(100, 160, 220, ${particle.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(80, 140, 200, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    particle.x - particle.size,
                    particle.y - particle.size,
                    particle.size * 2,
                    particle.size * 2
                );
            });

            // Feuilles avec meilleure visibilité
            leaves.forEach(leaf => {
                leaf.x += leaf.speedX + Math.sin(leaf.swing) * 0.2;
                leaf.y += leaf.speedY;
                leaf.swing += 0.15;

                if (leaf.y > canvas.height) {
                    leaf.y = -leaf.size;
                    leaf.x = Math.random() * canvas.width;
                }
                if (leaf.x > canvas.width) leaf.x = 0;
                if (leaf.x < 0) leaf.x = canvas.width;

                ctx.save();
                ctx.globalAlpha = leaf.opacity;
                ctx.fillStyle = leaf.color;
                ctx.beginPath();

                // Forme de feuille plus définie
                ctx.ellipse(
                    leaf.x,
                    leaf.y,
                    leaf.size,
                    leaf.size / 1.5,
                    Math.sin(leaf.swing) * 0.8,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                // Contour léger pour mieux voir
                ctx.strokeStyle = `rgba(255, 255, 255, ${leaf.opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.restore();
            });

            // Lueurs plus visibles
            const time = Date.now() * 0.001;
            const glowCount = 4;

            for (let i = 0; i < glowCount; i++) {
                const pulse = Math.sin(time * 0.3 + i * 1.5) * 0.5 + 0.5;
                const x = (canvas.width / (glowCount + 1)) * (i + 1) + Math.sin(time * 0.2 + i) * 50;
                const y = canvas.height * 0.6 + Math.sin(time * 0.4 + i) * 40;
                const size = 50 + pulse * 40;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                gradient.addColorStop(0, `rgba(255, 100, 100, ${0.3 * pulse})`);
                gradient.addColorStop(0.7, `rgba(200, 60, 60, ${0.1 * pulse})`);
                gradient.addColorStop(1, 'rgba(150, 30, 30, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(x - size, y - size, size * 2, size * 2);
            }

            // Étoiles filantes occasionnelles
            if (Math.random() < 0.002) {
                const star = {
                    x: Math.random() * canvas.width,
                    y: 0,
                    speed: Math.random() * 10 + 5,
                    length: Math.random() * 50 + 30,
                    opacity: Math.random() * 0.8 + 0.2
                };

                const drawShootingStar = () => {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(star.x - star.length * 0.7, star.y + star.length);
                    ctx.stroke();

                    // Traînée
                    const gradient = ctx.createLinearGradient(
                        star.x, star.y,
                        star.x - star.length * 0.7, star.y + star.length
                    );
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(star.x - star.length * 0.7, star.y + star.length);
                    ctx.stroke();
                };

                drawShootingStar();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: 9998,
                    opacity: 0.1
                }}
            />

            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 9997,
                    background: `
                        radial-gradient(ellipse at 20% 20%, rgba(0, 50, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 80%, rgba(0, 30, 50, 0.1) 0%, transparent 50%),
                        linear-gradient(0deg, rgba(0, 20, 0, 0.2) 0%, transparent 30%)
                    `,
                    opacity: 0.2
                }}
            >
                <div className="absolute bottom-0 left-0 w-full h-1/3">
                    <div
                        className="absolute bottom-0 left-0 w-full h-32"
                        style={{
                            background: `
                                linear-gradient(75deg, transparent 30%, rgba(0, 30, 0, 0.4) 30%, rgba(0, 40, 0, 0.4) 70%, transparent 70%),
                                linear-gradient(-75deg, transparent 30%, rgba(0, 25, 0, 0.3) 30%, rgba(0, 35, 0, 0.3) 70%, transparent 70%)
                            `,
                            maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
                        }}
                    />
                </div>
            </div>

            <div
                className="fixed top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
                style={{
                    zIndex: 9996,
                    background: 'radial-gradient(circle, rgba(100, 150, 255, 0.15) 0%, rgba(50, 100, 200, 0.05) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    opacity: 0.7
                }}
            />

            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full animate-float-slow"
                        style={{
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            background: `rgba(200, 255, 200, ${Math.random() * 0.3 + 0.1})`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    />
                ))}
            </div>

            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg); 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) rotate(90deg); 
                    }
                    50% { 
                        transform: translateY(-40px) translateX(-5px) rotate(180deg); 
                    }
                    75% { 
                        transform: translateY(-20px) translateX(-10px) rotate(270deg); 
                    }
                }
                
                .animate-float-slow {
                    animation: float-slow linear infinite;
                }
            `}</style>
        </>
    );
};

export default AmbientForest;