'use client';

import { useEffect, useRef } from 'react';

const AmbientForest = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isDarkTheme = document.documentElement.classList.contains('dark');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const fogColor = isDarkTheme ? '120, 180, 255' : '200, 220, 240';
        const fogOpacity = isDarkTheme ? 0.12 : 0.06;
        const leafColor = isDarkTheme ? 'hsl(120, 70%, 60%)' : 'hsl(120, 50%, 40%)';
        const background = isDarkTheme ? 'rgba(0, 0, 0, 0.015)' : 'rgba(255, 255, 255, 0.008)';

        particlesRef.current = Array.from({ length: isDarkTheme ? 20 : 15 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (isDarkTheme ? 150 : 100) + (isDarkTheme ? 80 : 60),
            speed: Math.random() * 0.2 + 0.05,
            opacity: Math.random() * fogOpacity + (fogOpacity * 0.3)
        }));

        const leaves = Array.from({ length: isDarkTheme ? 25 : 20 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 10 + 5,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * (isDarkTheme ? 0.4 : 0.25) + 0.1,
            swing: Math.random() * Math.PI * 2,
            color: leafColor
        }));

        let animationFrameId;

        const animate = () => {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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
                gradient.addColorStop(0, `rgba(${fogColor}, ${particle.opacity})`);
                gradient.addColorStop(0.7, `rgba(${fogColor}, ${particle.opacity * 0.3})`);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    particle.x - particle.size,
                    particle.y - particle.size,
                    particle.size * 2,
                    particle.size * 2
                );
            });

            leaves.forEach(leaf => {
                leaf.x += leaf.speedX + Math.sin(leaf.swing) * 0.15;
                leaf.y += leaf.speedY;
                leaf.swing += 0.1;

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
                ctx.ellipse(
                    leaf.x,
                    leaf.y,
                    leaf.size,
                    leaf.size / 1.8,
                    Math.sin(leaf.swing) * 0.6,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                if (isDarkTheme) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${leaf.opacity * 0.2})`;
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                background: 'transparent',
                zIndex: 9998,
                opacity: 0.1
            }}
        />
    );
};

export default AmbientForest;