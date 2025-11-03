'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type AnimationState = {
    colors: Array<{ r: number; g: number; b: number }>;
    isAbsorbing: boolean;
    isMixing: boolean;
    isSqueezing: boolean;
    drops: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: { r: number; g: number; b: number };
        life: number;
    }>;
    outputDrops: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        life: number;
    }>;
};

export function SpongeAnimated() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const [progress, setProgress] = useState(0);
    const [hash, setHash] = useState('');
    const [statusIcon, setStatusIcon] = useState('🎯');
    const [indicators, setIndicators] = useState({
        absorb: 0.5,
        transform: 0.5,
        squeeze: 0.5,
    });
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const stateRef = useRef<AnimationState>({
        colors: [],
        isAbsorbing: false,
        isMixing: false,
        isSqueezing: false,
        drops: [],
        outputDrops: [],
    });

    const inputColors = [
        { r: 239, g: 68, b: 68 }, // Red
        { r: 245, g: 158, b: 11 }, // Yellow
        { r: 34, g: 197, b: 94 }, // Green
    ];

    useEffect(() => {
        const autoPlay = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await runFullDemo();
        };
        autoPlay();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function drawSponge() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const state = stateRef.current;

            // Calculate mixed color
            let avgR = 255,
                avgG = 248,
                avgB = 220;

            if (state.colors.length > 0) {
                let totalR = avgR,
                    totalG = avgG,
                    totalB = avgB;
                state.colors.forEach((color) => {
                    totalR += color.r * 0.3;
                    totalG += color.g * 0.3;
                    totalB += color.b * 0.3;
                });
                avgR = Math.min(255, totalR / (1 + state.colors.length * 0.3));
                avgG = Math.min(255, totalG / (1 + state.colors.length * 0.3));
                avgB = Math.min(255, totalB / (1 + state.colors.length * 0.3));
            }

            // Draw sponge with gradient
            const gradient = ctx.createLinearGradient(0, 50, 0, 300);
            gradient.addColorStop(0, `rgba(59, 130, 246, 0.8)`);
            gradient.addColorStop(0.4, `rgba(${avgR}, ${avgG}, ${avgB}, 1)`);
            gradient.addColorStop(
                0.6,
                `rgba(${avgR * 0.9}, ${avgG * 0.9}, ${avgB * 0.9}, 1)`
            );
            gradient.addColorStop(1, `rgba(34, 197, 94, 0.8)`);

            // Sponge body
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(300, 100);
            ctx.lineTo(320, 300);
            ctx.lineTo(80, 300);
            ctx.closePath();
            ctx.fill();

            // Divider line
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(90, 200);
            ctx.lineTo(310, 200);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('RATE (r)', 200, 150);
            ctx.font = '12px sans-serif';
            ctx.fillText('1088 bits', 200, 170);

            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('CAPACITY (c)', 200, 250);
            ctx.font = '12px sans-serif';
            ctx.fillText('512 bits (secreto)', 200, 270);

            // Draw input drops
            state.drops = state.drops.filter((drop) => {
                drop.x += drop.vx;
                drop.y += drop.vy;
                drop.life -= 0.02;

                ctx.fillStyle = `rgba(${drop.color.r}, ${drop.color.g}, ${drop.color.b}, ${drop.life})`;
                ctx.beginPath();
                ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                ctx.fill();

                return drop.life > 0;
            });

            // Draw output drops
            state.outputDrops = state.outputDrops.filter((drop) => {
                drop.x += drop.vx;
                drop.y += drop.vy;
                drop.life -= 0.01;

                const dropGradient = ctx.createRadialGradient(
                    drop.x,
                    drop.y,
                    0,
                    drop.x,
                    drop.y,
                    drop.radius
                );
                dropGradient.addColorStop(
                    0,
                    `rgba(139, 92, 246, ${drop.life})`
                );
                dropGradient.addColorStop(
                    1,
                    `rgba(168, 85, 247, ${drop.life * 0.5})`
                );

                ctx.fillStyle = dropGradient;
                ctx.beginPath();
                ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                ctx.fill();

                return drop.life > 0 && drop.x < canvas.width;
            });
        }

        function animate() {
            drawSponge();
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    async function addColors() {
        const state = stateRef.current;
        if (state.isAbsorbing) return;

        state.isAbsorbing = true;
        setStatusIcon('🧽');
        setIndicators((prev) => ({ ...prev, absorb: 1 }));

        for (
            let colorIndex = 0;
            colorIndex < inputColors.length;
            colorIndex++
        ) {
            state.colors.push(inputColors[colorIndex]);

            // Create drops
            for (let i = 0; i < 10; i++) {
                state.drops.push({
                    x: 50,
                    y: 150 + Math.random() * 100,
                    vx: 2 + Math.random() * 2,
                    vy: (Math.random() - 0.5) * 2,
                    radius: 5 + Math.random() * 10,
                    color: inputColors[colorIndex],
                    life: 1,
                });
            }

            setProgress(((colorIndex + 1) / inputColors.length) * 33);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        state.isAbsorbing = false;
        setIndicators((prev) => ({ ...prev, absorb: 0.5 }));
    }

    async function mixWithKeccak() {
        const state = stateRef.current;
        if (state.isMixing || state.colors.length === 0) return;

        state.isMixing = true;
        setStatusIcon('🌀');
        setIndicators((prev) => ({ ...prev, transform: 1 }));

        for (let i = 0; i < 5; i++) {
            setProgress(33 + ((i + 1) / 5) * 33);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        state.isMixing = false;
        setIndicators((prev) => ({ ...prev, transform: 0.5 }));
    }

    async function squeezeHash() {
        const state = stateRef.current;
        if (state.isSqueezing || state.colors.length === 0) return;

        state.isSqueezing = true;
        setStatusIcon('💦');
        setIndicators((prev) => ({ ...prev, squeeze: 1 }));

        const interval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                state.outputDrops.push({
                    x: 320,
                    y: 250 + Math.random() * 50,
                    vx: 2 + Math.random() * 3,
                    vy: (Math.random() - 0.5) * 2,
                    radius: 5 + Math.random() * 8,
                    life: 1,
                });
            }
        }, 100);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        clearInterval(interval);

        // Generate hash
        const generatedHash = Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');

        setHash(generatedHash);
        setProgress(100);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        state.isSqueezing = false;
        setIndicators((prev) => ({ ...prev, squeeze: 0.5 }));
        setStatusIcon('✅');
    }

    async function runFullDemo() {
        setIsAutoPlaying(true);
        resetAnimation();
        await addColors();
        await mixWithKeccak();
        await squeezeHash();
        setIsAutoPlaying(false);
    }

    function resetAnimation() {
        stateRef.current = {
            colors: [],
            isAbsorbing: false,
            isMixing: false,
            isSqueezing: false,
            drops: [],
            outputDrops: [],
        };
        setProgress(0);
        setHash('');
        setStatusIcon('🎯');
        setIndicators({ absorb: 0.5, transform: 0.5, squeeze: 0.5 });
    }

    function stopAnimation() {
        stateRef.current = {
            colors: [],
            isAbsorbing: false,
            isMixing: false,
            isSqueezing: false,
            drops: [],
            outputDrops: [],
        };
        setProgress(0);
        setHash('');
        setStatusIcon('🎯');
        setIndicators({ absorb: 0.5, transform: 0.5, squeeze: 0.5 });
        setIsAutoPlaying(false);
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg">
                    1
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Construcción Sponge: Visualización Animada
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Observa cómo SHA-3 absorbe y exprime datos en tiempo
                        real
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                        SHA-3 utiliza la construcción Sponge, que literalmente
                        funciona como una esponja: absorbe datos como colores y
                        los exprime para generar el hash.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Canvas */}
                        <div className="flex-1 flex justify-center">
                            <canvas
                                ref={canvasRef}
                                width="400"
                                height="450"
                                className="rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Control Panel */}
                        <div className="flex-1 space-y-4">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white flex items-center gap-2">
                                        <span className="text-2xl">
                                            {statusIcon}
                                        </span>
                                        Estado Actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-400 font-medium">
                                                Rate (r):
                                            </span>
                                            <span className="text-white font-mono font-semibold">
                                                1088 bits
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-400 font-medium">
                                                Capacity (c):
                                            </span>
                                            <span className="text-white font-mono font-semibold">
                                                512 bits
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">
                                                Progreso
                                            </span>
                                            <span className="text-slate-300 font-semibold">
                                                {progress}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={progress}
                                            className="h-3"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">
                                        🎮 Demostración Interactiva
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        onClick={addColors}
                                        disabled={isAutoPlaying}
                                        className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600 shadow-lg transition-all"
                                    >
                                        🎨 Agregar Colores (Mensajes)
                                    </Button>
                                    <Button
                                        onClick={mixWithKeccak}
                                        disabled={isAutoPlaying}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all"
                                    >
                                        🌀 Mezclar con Keccak-f
                                    </Button>
                                    <Button
                                        onClick={squeezeHash}
                                        disabled={isAutoPlaying}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all"
                                    >
                                        💦 Exprimir Hash
                                    </Button>
                                    <Button
                                        onClick={runFullDemo}
                                        disabled={isAutoPlaying}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg transition-all"
                                    >
                                        ✨ Demostración Automática
                                    </Button>
                                    <Button
                                        onClick={stopAnimation}
                                        disabled={!isAutoPlaying}
                                        variant="outline"
                                        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all bg-transparent"
                                    >
                                        ⏹️ Detener Animación
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Process Indicators */}
                            <div className="flex justify-around p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                                {[
                                    {
                                        id: 'absorb',
                                        label: 'Absorber',
                                        opacity: indicators.absorb,
                                        color: 'bg-blue-500',
                                    },
                                    {
                                        id: 'transform',
                                        label: 'Transformar',
                                        opacity: indicators.transform,
                                        color: 'bg-indigo-500',
                                    },
                                    {
                                        id: 'squeeze',
                                        label: 'Exprimir',
                                        opacity: indicators.squeeze,
                                        color: 'bg-purple-500',
                                    },
                                ].map((indicator, i) => (
                                    <div
                                        key={indicator.id}
                                        className="text-center transition-opacity duration-300"
                                        style={{ opacity: indicator.opacity }}
                                    >
                                        <div
                                            className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${indicator.color} shadow-lg text-white font-bold`}
                                        >
                                            {i + 1}
                                        </div>
                                        <span className="text-xs text-slate-300 font-medium">
                                            {indicator.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hash Output */}
                    {hash && (
                        <Card className="mt-6 rounded-xl bg-gradient-to-br from-purple-950 via-fuchsia-900/70 to-pink-900/60 border border-purple-700/60 shadow-lg shadow-fuchsia-800/30">
                            <CardHeader>
                                <CardTitle className="text-purple-400">
                                    Hash SHA3-256 Generado:
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <code className="text-sm text-slate-200 font-mono break-all block p-3 bg-slate-900/50 rounded">
                                    {hash}
                                </code>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-red-950/20 border-red-800/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                            <span className="text-2xl">⚠️</span> SHA-2
                            (Merkle-Damgård)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>Estado público visible</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>
                                    Vulnerable a ataques de extensión de
                                    longitud
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>Tamaño de salida fijo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>Diseño más tradicional</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-800/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                            <span className="text-2xl">✅</span> SHA-3 (Sponge)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>Capacity oculta (seguridad interna)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>Inmune a ataques de extensión</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>Salida de longitud variable (XOF)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>Diseño completamente diferente</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
