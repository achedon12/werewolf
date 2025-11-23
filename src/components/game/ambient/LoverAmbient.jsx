import {useEffect, useRef} from "react";

const LoverAmbient = ({data = {}, duration = 8000, onClose}) => {
    const canvasRef = useRef(null);
    const heartsRef = useRef([]);
    const particlesRef = useRef([]);
    const startRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        heartsRef.current = Array.from({length: 35}, () => createHeart(canvas));
        particlesRef.current = Array.from({length: 80}, () => createParticle(canvas));

        let rafId;
        const t0 = Date.now();
        startRef.current = t0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(255, 200, 220, 0.15)");
            gradient.addColorStop(0.5, "rgba(255, 180, 200, 0.08)");
            gradient.addColorStop(1, "rgba(255, 160, 180, 0.04)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.life -= 0.005;

                if (p.life <= 0 || p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
                    Object.assign(p, createParticle(canvas));
                }

                ctx.save();
                ctx.globalAlpha = p.life * p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            heartsRef.current.forEach(h => {
                h.y -= h.speedY;
                h.x += Math.sin((h.phase += h.freq)) * h.swing;
                h.alpha -= 0.0006;
                h.rotation += h.rotationSpeed;

                if (h.alpha <= 0 || h.y + h.size < 0) {
                    Object.assign(h, createHeart(canvas, true));
                }

                ctx.save();
                ctx.translate(h.x, h.y);
                ctx.rotate(h.rotation);
                ctx.globalAlpha = h.alpha * 0.9;

                if (h.glow) {
                    ctx.shadowColor = `rgba(255, ${Math.floor(100 + h.tint)}, ${Math.floor(120 + h.tint)}, 0.8)`;
                    ctx.shadowBlur = 15;
                }

                ctx.fillStyle = `rgba(255, ${Math.floor(100 + h.tint)}, ${Math.floor(120 + h.tint)}, 1)`;
                drawHeart(ctx, 0, 0, h.size);
                ctx.restore();
            });

            const centerX = canvas.width * 0.5;
            const centerY = canvas.height * 0.45;
            const elapsed = (Date.now() - t0) * 0.002;
            const pulse = 1 + Math.sin(elapsed * 2.5) * 0.1;
            const rotation = Math.sin(elapsed * 1.5) * 0.1;

            ctx.save();
            ctx.globalCompositeOperation = "lighter";

            const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
            glowGradient.addColorStop(0, "rgba(255, 180, 220, 0.6)");
            glowGradient.addColorStop(0.3, "rgba(255, 150, 190, 0.3)");
            glowGradient.addColorStop(0.6, "rgba(255, 120, 160, 0.15)");
            glowGradient.addColorStop(1, "rgba(255, 100, 140, 0)");
            ctx.fillStyle = glowGradient;
            ctx.fillRect(centerX - 300, centerY - 300, 600, 600);

            ctx.globalAlpha = 0.7;
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + elapsed;
                const radius = 80 + Math.sin(elapsed * 4 + i) * 10;
                const px = centerX + Math.cos(angle) * radius;
                const py = centerY + Math.sin(angle) * radius;

                ctx.save();
                ctx.globalAlpha = 0.4 + Math.sin(elapsed * 3 + i) * 0.3;
                ctx.fillStyle = `rgba(255, ${150 + Math.sin(elapsed + i) * 50}, ${180 + Math.cos(elapsed + i) * 50}, 1)`;
                drawHeart(ctx, px, py, 8 + Math.sin(elapsed * 2 + i) * 3);
                ctx.restore();
            }

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            ctx.strokeStyle = "rgba(255, 200, 220, 0.8)";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -elapsed * 20;
            ctx.beginPath();
            ctx.moveTo(-40, 0);
            ctx.lineTo(40, 0);
            ctx.stroke();

            ctx.globalAlpha = 0.95;
            ctx.shadowColor = "rgba(255, 100, 150, 0.8)";
            ctx.shadowBlur = 20;

            ctx.fillStyle = "rgba(255, 140, 180, 1)";
            drawHeart(ctx, -35 * pulse, 0, 32 * pulse);

            ctx.fillStyle = "rgba(255, 160, 200, 1)";
            drawHeart(ctx, 35 * pulse, 0, 32 * pulse);

            ctx.restore();

            if (Math.random() < 0.02) {
                createFallingPetal(canvas);
            }

            particlesRef.current.forEach((p, index) => {
                if (p.type === 'petal') {
                    p.y += p.speed;
                    p.x += Math.sin(p.phase += 0.05) * 0.5;
                    p.rotation += p.rotationSpeed;
                    p.alpha -= 0.002;

                    if (p.alpha <= 0 || p.y > canvas.height) {
                        particlesRef.current.splice(index, 1);
                    }

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    drawPetal(ctx, 0, 0, p.size);
                    ctx.restore();
                }
            });

            rafId = requestAnimationFrame(animate);
        };

        animate();

        const hideTimer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafId);
            clearTimeout(hideTimer);
        };
    }, [data, duration, onClose]);

    const createFallingPetal = (canvas) => {
        particlesRef.current.push({
            type: 'petal',
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            phase: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.5 + 0.3,
            color: `rgba(255, ${Math.floor(180 + Math.random() * 40)}, ${Math.floor(200 + Math.random() * 40)}, 1)`
        });
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 9999,
                    background: "transparent",
                }}
            />
            <div
                className="fixed inset-0 pointer-events-none flex items-center justify-center"
                style={{zIndex: 10000}}
            >
                <div className="text-center" style={{
                    color: "rgba(255, 230, 240, 0.95)",
                    pointerEvents: "none",
                    textShadow: "0 4px 20px rgba(255, 90, 130, 0.4)",
                    backdropFilter: "blur(2px)"
                }}>
                    <div style={{
                        fontSize: "clamp(20px, 4vw, 28px)",
                        fontWeight: 700,
                        marginBottom: 8,
                        background: "linear-gradient(45deg, #ffb6c1, #ff69b4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        💕 Cœurs Liés 💕
                    </div>
                    <div style={{
                        fontSize: "clamp(16px, 3vw, 22px)",
                        fontWeight: 600,
                        opacity: 0.9
                    }}>
                        {data.loverName && `❤️ ${data.playerName}`}
                    </div>
                    <div style={{
                        fontSize: "clamp(12px, 2vw, 16px)",
                        fontWeight: 500,
                        opacity: 0.7,
                        marginTop: 8
                    }}>
                        Unis pour l'éternité
                    </div>
                </div>
            </div>
        </>
    );
};

const createHeart = (canvas, fromTop = false) => {
    const w = canvas ? canvas.width : window.innerWidth;
    const h = canvas ? canvas.height : window.innerHeight;
    const size = Math.random() * 20 + 10;
    return {
        x: Math.random() * w,
        y: fromTop ? h + Math.random() * 40 : h + Math.random() * h * 0.5,
        size,
        speedY: Math.random() * 0.8 + 0.3,
        swing: Math.random() * 15 + 8,
        phase: Math.random() * Math.PI * 2,
        freq: Math.random() * 0.08 + 0.02,
        alpha: Math.random() * 0.7 + 0.3,
        tint: Math.random() * 80,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        glow: Math.random() < 0.3
    };
};

const createParticle = (canvas) => {
    const w = canvas ? canvas.width : window.innerWidth;
    const h = canvas ? canvas.height : window.innerHeight;
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        life: Math.random() * 0.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        color: `rgba(255, ${Math.floor(150 + Math.random() * 80)}, ${Math.floor(170 + Math.random() * 60)}, 1)`
    };
};

const drawHeart = (ctx, x, y, size) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + topCurveHeight);
    ctx.bezierCurveTo(x - size, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size, y + (size + topCurveHeight) / 2, x + size, y + topCurveHeight);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
};

const drawPetal = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.8, size * 0.4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
};

export default LoverAmbient;