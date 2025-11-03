'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function SpongeConstruction() {
    const [phase, setPhase] = useState<
        'idle' | 'absorb' | 'squeeze' | 'complete'
    >('idle');
    const [explanation, setExplanation] = useState(getInitialExplanation());

    function getInitialExplanation() {
        return {
            title: '¿Cómo funciona?',
            content: (
                <>
                    <p>
                        La construcción Sponge tiene un estado interno de{' '}
                        <strong className="text-blue-400">
                            b = r + c bits
                        </strong>
                        :
                    </p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>
                            <strong className="text-blue-400">Rate (r)</strong>:
                            Parte que interactúa con los datos
                        </li>
                        <li>
                            <strong className="text-green-400">
                                Capacity (c)
                            </strong>
                            : Parte secreta que garantiza la seguridad
                        </li>
                    </ul>
                    <p className="mt-2">
                        Para SHA3-256: r = 1088 bits, c = 512 bits (total: 1600
                        bits)
                    </p>
                </>
            ),
        };
    }

    async function handleAbsorb() {
        setPhase('absorb');
        setExplanation({
            title: '🧽 Absorbiendo el mensaje...',
            content: (
                <>
                    <p>
                        Los bloques del mensaje entran por la parte{' '}
                        <strong className="text-blue-400">rate</strong>.
                    </p>
                    <p>
                        Se hace XOR con el estado y se aplica la permutación
                        Keccak-f.
                    </p>
                    <p className="mt-2">
                        La parte{' '}
                        <strong className="text-green-400">capacity</strong>{' '}
                        permanece intacta, garantizando la seguridad.
                    </p>
                </>
            ),
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        setPhase('idle');
    }

    async function handleSqueeze() {
        setPhase('squeeze');
        setExplanation({
            title: '💧 Exprimiendo el hash...',
            content: (
                <>
                    <p>
                        Extraemos bits de la parte{' '}
                        <strong className="text-blue-400">rate</strong> del
                        estado.
                    </p>
                    <p>
                        Si necesitamos más bits, aplicamos Keccak-f y
                        continuamos.
                    </p>
                    <p className="mt-2">
                        El hash final tiene la longitud deseada (256 bits para
                        SHA3-256).
                    </p>
                </>
            ),
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        setPhase('idle');
    }

    async function handleComplete() {
        // Initialization
        setPhase('idle');
        setExplanation({
            title: '📝 Preparando el estado...',
            content: <p>El estado se inicializa con 1600 bits en cero.</p>,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Absorb
        setPhase('absorb');
        setExplanation({
            title: '🧽 Absorbiendo bloques...',
            content: <p>Procesando el mensaje bloque por bloque.</p>,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Squeeze
        setPhase('squeeze');
        setExplanation({
            title: '💧 Generando el hash...',
            content: <p>Extrayendo 256 bits del estado.</p>,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Complete
        setPhase('complete');
        setExplanation({
            title: '✅ Hash SHA3-256 generado',
            content: (
                <p>
                    El proceso completo garantiza alta seguridad y resistencia a
                    ataques.
                </p>
            ),
        });
    }

    function handleReset() {
        setPhase('idle');
        setExplanation(getInitialExplanation());
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl shadow-lg">
                    1
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Construcción Sponge: El Corazón de SHA-3
                    </h2>
                    <p className="text-slate-400 mt-1">
                        La arquitectura revolucionaria que define SHA-3
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                        SHA-3 utiliza la construcción Sponge, una arquitectura
                        revolucionaria que funciona como una esponja: absorbe
                        datos y los exprime para generar el hash.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-1 flex justify-center">
                            <svg
                                width="320"
                                height="380"
                                viewBox="0 0 320 380"
                                className="max-w-full"
                            >
                                <defs>
                                    <linearGradient
                                        id="rateGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#3B82F6"
                                            stopOpacity="1"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#1D4ED8"
                                            stopOpacity="0.9"
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="capacityGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#10B981"
                                            stopOpacity="0.9"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#047857"
                                            stopOpacity="1"
                                        />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur
                                            stdDeviation="3"
                                            result="coloredBlur"
                                        />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Rate section with enhanced animation */}
                                <rect
                                    x="60"
                                    y="60"
                                    width="200"
                                    height="120"
                                    rx="20"
                                    fill="url(#rateGradient)"
                                    stroke="#60A5FA"
                                    strokeWidth="3"
                                    opacity={phase === 'absorb' ? '1' : '0.85'}
                                    filter={
                                        phase === 'absorb' ? 'url(#glow)' : ''
                                    }
                                    className="transition-all duration-500"
                                />

                                {/* Divider line */}
                                <line
                                    x1="60"
                                    y1="180"
                                    x2="260"
                                    y2="180"
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                />

                                {/* Capacity section */}
                                <rect
                                    x="60"
                                    y="180"
                                    width="200"
                                    height="130"
                                    rx="20"
                                    fill="url(#capacityGradient)"
                                    stroke="#34D399"
                                    strokeWidth="3"
                                    opacity="0.85"
                                />

                                {[
                                    { cx: 100, cy: 100, r: 8 },
                                    { cx: 160, cy: 120, r: 10 },
                                    { cx: 220, cy: 105, r: 7 },
                                    { cx: 130, cy: 140, r: 9 },
                                    { cx: 190, cy: 150, r: 6 },
                                ].map((pore, i) => (
                                    <circle
                                        key={`rate-${i}`}
                                        {...pore}
                                        fill="#1E40AF"
                                        opacity={
                                            phase === 'absorb' ? '0.9' : '0.6'
                                        }
                                        className="transition-opacity duration-500"
                                    >
                                        {phase === 'absorb' && (
                                            <animate
                                                attributeName="r"
                                                values={`${pore.r};${
                                                    pore.r + 2
                                                };${pore.r}`}
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        )}
                                    </circle>
                                ))}

                                {/* Capacity pores */}
                                {[
                                    { cx: 110, cy: 220, r: 8 },
                                    { cx: 170, cy: 240, r: 10 },
                                    { cx: 210, cy: 210, r: 7 },
                                    { cx: 140, cy: 270, r: 9 },
                                ].map((pore, i) => (
                                    <circle
                                        key={`capacity-${i}`}
                                        {...pore}
                                        fill="#047857"
                                        opacity="0.6"
                                    />
                                ))}

                                {/* Labels */}
                                <text
                                    x="160"
                                    y="120"
                                    textAnchor="middle"
                                    fill="white"
                                    fontWeight="bold"
                                    fontSize="18"
                                >
                                    RATE (r bits)
                                </text>
                                <text
                                    x="160"
                                    y="140"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="13"
                                    opacity="0.9"
                                >
                                    Parte pública
                                </text>
                                <text
                                    x="160"
                                    y="245"
                                    textAnchor="middle"
                                    fill="white"
                                    fontWeight="bold"
                                    fontSize="18"
                                >
                                    CAPACITY (c bits)
                                </text>
                                <text
                                    x="160"
                                    y="265"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="13"
                                    opacity="0.9"
                                >
                                    Seguridad
                                </text>

                                {phase === 'absorb' && (
                                    <g opacity="1">
                                        <rect
                                            x="20"
                                            y="110"
                                            width="30"
                                            height="20"
                                            fill="#F59E0B"
                                            rx="3"
                                            className="animate-pulse"
                                        />
                                        <text
                                            x="35"
                                            y="125"
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            M
                                        </text>
                                        <path
                                            d="M 50 120 L 60 120"
                                            stroke="#F59E0B"
                                            strokeWidth="2"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    </g>
                                )}

                                {(phase === 'squeeze' ||
                                    phase === 'complete') && (
                                    <g opacity="1">
                                        <rect
                                            x="270"
                                            y="110"
                                            width="30"
                                            height="20"
                                            fill="#8B5CF6"
                                            rx="3"
                                            className="animate-pulse"
                                        />
                                        <text
                                            x="285"
                                            y="125"
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            H
                                        </text>
                                        <path
                                            d="M 260 120 L 270 120"
                                            stroke="#8B5CF6"
                                            strokeWidth="2"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    </g>
                                )}

                                {/* Phase indicator */}
                                <text
                                    x="160"
                                    y="40"
                                    textAnchor="middle"
                                    fill={
                                        phase === 'complete'
                                            ? '#10B981'
                                            : '#60A5FA'
                                    }
                                    fontSize="20"
                                    fontWeight="bold"
                                    opacity={phase !== 'idle' ? '1' : '0'}
                                    className="transition-opacity duration-300"
                                >
                                    {phase === 'absorb' && 'FASE DE ABSORCIÓN'}
                                    {phase === 'squeeze' && 'FASE DE EXPRIMIDO'}
                                    {phase === 'complete' && '¡COMPLETADO!'}
                                </text>
                            </svg>
                        </div>

                        {/* Control Panel */}
                        <div className="flex-1 space-y-4">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">
                                        {explanation.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-slate-300 space-y-2">
                                        {explanation.content}
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
                                        onClick={handleAbsorb}
                                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50 transition-all"
                                        disabled={phase !== 'idle'}
                                    >
                                        🧽 Fase de Absorción
                                    </Button>
                                    <Button
                                        onClick={handleSqueeze}
                                        className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/50 transition-all"
                                        disabled={phase !== 'idle'}
                                    >
                                        💧 Fase de Exprimido
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-purple-500/50 transition-all"
                                        disabled={phase !== 'idle'}
                                    >
                                        ▶️ Proceso Completo
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        🔄 Reiniciar
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Process */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-blue-950/30 border-blue-800/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                            <span className="text-2xl">🧽</span> Fase de
                            Absorción
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                            <li>El mensaje se divide en bloques de r bits</li>
                            <li>
                                Cada bloque se XOR con la parte rate del estado
                            </li>
                            <li>
                                Se aplica la función de permutación
                                Keccak-f[1600]
                            </li>
                            <li>Se repite hasta procesar todo el mensaje</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="bg-purple-950/30 border-purple-800/50">
                    <CardHeader>
                        <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                            <span className="text-2xl">💧</span> Fase de
                            Exprimido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                            <li>Se extraen r bits del estado como salida</li>
                            <li>
                                Si necesitamos más bits, aplicamos
                                Keccak-f[1600]
                            </li>
                            <li>
                                Repetimos hasta obtener el tamaño de hash
                                deseado
                            </li>
                            <li>Para SHA3-256, solo necesitamos 256 bits</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>

            {/* Advantages */}
            <Card className="bg-gradient-to-br from-yellow-950/30 to-orange-950/30 border-yellow-800/50">
                <CardHeader>
                    <CardTitle className="text-xl text-yellow-400">
                        ⭐ Ventajas de la Construcción Sponge
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {[
                            {
                                label: 'Simplicidad',
                                desc: 'Un solo algoritmo para cualquier tamaño de salida',
                                icon: '✨',
                            },
                            {
                                label: 'Seguridad',
                                desc: 'Resistente a ataques de extensión de longitud',
                                icon: '🛡️',
                            },
                            {
                                label: 'Flexibilidad',
                                desc: 'Salida de longitud variable (XOF)',
                                icon: '🔄',
                            },
                            {
                                label: 'Paralelizable',
                                desc: 'Se puede implementar eficientemente en hardware',
                                icon: '⚡',
                            },
                        ].map((advantage, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50"
                            >
                                <span className="text-2xl">
                                    {advantage.icon}
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-200">
                                        {advantage.label}
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        {advantage.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
