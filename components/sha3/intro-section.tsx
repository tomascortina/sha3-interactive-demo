import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function IntroSection() {
    return (
        <section className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-center gap-8 p-8">
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-2xl h-72 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/GifPrincipal.gif"
                                    alt="SHA-3 Animation"
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover rounded-lg"
                                    unoptimized
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Bienvenido al Análisis de SHA-3
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Esta página presenta una exploración interactiva
                                y visual del algoritmo criptográfico SHA-3, el
                                estándar de hash más moderno desarrollado por
                                NIST.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                A través de demostraciones animadas y ejemplos
                                prácticos, descubrirás cómo funciona la
                                construcción Sponge, las permutaciones Keccak-f,
                                y las ventajas de seguridad que hacen de SHA-3
                                una alternativa robusta a SHA-2.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
