'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SpongePhases() {
    return (
        <div className="space-y-6 mt-8">
            {/* Phases */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-orange-900/40 shadow-lg shadow-orange-900/20">
                    <CardHeader>
                        <CardTitle className="text-xl text-orange-400 flex items-center gap-2">
                            <span className="text-2xl">🧽</span> Fase de
                            Absorción
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-400 font-bold mt-0.5">
                                    1.
                                </span>
                                <span>
                                    El mensaje se divide en bloques de r bits
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-400 font-bold mt-0.5">
                                    2.
                                </span>
                                <span>
                                    Cada bloque se XOR con la parte rate del
                                    estado
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-400 font-bold mt-0.5">
                                    3.
                                </span>
                                <span>
                                    Se aplica la función de permutación
                                    Keccak-f[1600]
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-400 font-bold mt-0.5">
                                    4.
                                </span>
                                <span>
                                    Se repite hasta procesar todo el mensaje
                                </span>
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/40 shadow-lg shadow-blue-900/20">
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                            <span className="text-2xl">💧</span> Fase de
                            Exprimido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">
                                    1.
                                </span>
                                <span>
                                    Se extraen r bits del estado como salida
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">
                                    2.
                                </span>
                                <span>
                                    Si necesitamos más bits, aplicamos
                                    Keccak-f[1600]
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">
                                    3.
                                </span>
                                <span>
                                    Repetimos hasta obtener el tamaño de hash
                                    deseado
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">
                                    4.
                                </span>
                                <span>
                                    Para SHA3-256, solo necesitamos 256 bits
                                </span>
                            </li>
                        </ol>
                    </CardContent>
                </Card>
            </div>

            {/* Advantages */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-600/30">
                <CardHeader>
                    <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                        <span className="text-3xl">⭐</span> Ventajas de la
                        Construcción Sponge
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
                            <div className="text-3xl mb-2">🎯</div>
                            <h3 className="font-semibold text-blue-400 mb-2">
                                Simplicidad
                            </h3>
                            <p className="text-sm text-slate-400">
                                Un solo algoritmo para cualquier tamaño de
                                salida
                            </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
                            <div className="text-3xl mb-2">🛡️</div>
                            <h3 className="font-semibold text-green-400 mb-2">
                                Seguridad
                            </h3>
                            <p className="text-sm text-slate-400">
                                Resistente a ataques de extensión de longitud
                            </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
                            <div className="text-3xl mb-2">📏</div>
                            <h3 className="font-semibold text-purple-400 mb-2">
                                Flexibilidad
                            </h3>
                            <p className="text-sm text-slate-400">
                                Salida de longitud variable (XOF)
                            </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-pink-500/30">
                            <div className="text-3xl mb-2">⚡</div>
                            <h3 className="font-semibold text-pink-400 mb-2">
                                Paralelizable
                            </h3>
                            <p className="text-sm text-slate-400">
                                Se puede implementar eficientemente en hardware
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
