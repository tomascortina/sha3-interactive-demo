'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const permutations = [
    {
        symbol: 'θ',
        name: 'Theta',
        description:
            'Calcula, para cada bit, el XOR entre ese bit y una combinación de las columnas vecinas (la columna actual y las adyacentes, con aritmética módulo 5 en los índices). En la práctica, se obtiene el XOR de cada columna completa y ese resultado se propaga a las columnas vecinas. Con esto, la información "salta" a lo largo de las columnas y se difunde rápidamente por todo el estado, iniciando la mezcla global.',
        image: '/ThetaGIF.gif',
    },
    {
        symbol: 'ρ',
        name: 'Rho',
        description:
            'Aplica rotaciones bit a bit dentro de cada "lane" de 64 bits (cada columna vertical de profundidad 64). Al rotar cantidades distintas en cada lane, los patrones producidos por θ se desalinean, de modo que, cuando vuelvan a combinarse en pasos posteriores, afecten a posiciones diferentes. ρ no mezcla posiciones entre lanes, pero reubica los bits dentro de cada uno para favorecer una difusión más amplia en las rondas siguientes.',
        image: '/RhoGIF.gif',
    },
    {
        symbol: 'π',
        name: 'Pi',
        description:
            'Reordena las posiciones moviendo cada lane a otra coordenada del arreglo 5×5 (una permutación fija de las coordenadas). Así, datos que estaban cercanos pasan a estar lejos (y viceversa). Combinado con ρ, esto hace que en la próxima θ los XOR de columnas involucren bits que antes no estaban relacionados, acelerando la difusión entre regiones del estado (las zonas de "rate" y "capacity").',
        image: '/PiGIF.gif',
    },
    {
        symbol: 'χ',
        name: 'Chi',
        description:
            'Es la única transformación no lineal. Para cada fila de 5 bits (y para cada una de sus 64 "capas"), actualiza cada bit como: bit := bit ⊕ ((¬bit_siguiente) ∧ bit_siguiente_siguiente) (con índices módulo 5). Esta operación introduce confusión (no linealidad) indispensable para la seguridad: rompe relaciones lineales simples entre entrada y salida, haciendo ineficaces aproximaciones lineales y ayudando a la resistencia criptoanalítica.',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Chi-WAfAudFkg86B5ilOg5UPiLHFFP2RST.png',
    },
    {
        symbol: 'ι',
        name: 'Iota',
        description:
            'Inyecta una constante de ronda (derivada de un LFSR) en una posición específica del estado mediante XOR. Su objetivo es romper simetrías globales (por ejemplo, si el estado estuviera en cero o en patrones altamente regulares) y evitar que permutaciones puramente estructurales generen ciclos o puntos fijos. ι no difunde por sí sola, pero "destraba" la mezcla para que θ, ρ, π y χ funcionen con máxima eficacia en cada ronda.',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Iota-fBmZjcRpKWnroZvrJh5NFitkJAbVBe.png',
    },
];

export function KeccakPermutations() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? permutations.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) =>
            prev === permutations.length - 1 ? 0 : prev + 1
        );
    };

    const currentPermutation = permutations[currentIndex];
    const progress = ((currentIndex + 1) / permutations.length) * 100;

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg">
                    4
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Permutaciones de Keccak-f
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Las 5 operaciones que transforman el estado en cada
                        ronda
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                        Cada ronda de Keccak-f aplica cinco transformaciones en
                        secuencia (θ → ρ → π → χ → ι) sobre el estado de 1600
                        bits. Estas operaciones trabajan juntas para lograr
                        difusión completa y no linealidad.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Progress Bar with Dots */}
                    <div className="relative">
                        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="absolute inset-0 flex justify-between items-center px-2">
                            {permutations.map((perm, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-center justify-center"
                                >
                                    <button
                                        onClick={() => goToSlide(index)}
                                        className={`w-4 h-4 rounded-full border-2 transition-all duration-500 cursor-pointer ${
                                            index === currentIndex
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 scale-125 shadow-lg shadow-purple-500/50'
                                                : index < currentIndex
                                                ? 'bg-purple-500/50 border-purple-500/50'
                                                : 'bg-slate-800 border-slate-600 hover:border-purple-400/50'
                                        }`}
                                        aria-label={`Ir a ${perm.name}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Content */}
                    <div className="relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700 p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left: Text Content */}
                            <div className="space-y-6 order-2 md:order-1">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                            {currentPermutation.symbol}
                                        </span>
                                        <h3 className="text-3xl font-bold text-slate-200">
                                            {currentPermutation.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-400 font-semibold">
                                        Operación {currentIndex + 1} de{' '}
                                        {permutations.length}
                                    </p>
                                </div>

                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {currentPermutation.description}
                                </p>
                            </div>

                            {/* Right: Image */}
                            <div className="order-1 md:order-2">
                                <div className="rounded-xl bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={
                                            currentPermutation.image ||
                                            '/placeholder.svg'
                                        }
                                        alt={`Visualización de la operación ${currentPermutation.name}`}
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-contain"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={goToPrevious}
                            variant="outline"
                            size="lg"
                            className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-purple-500 text-slate-200 transition-all duration-200"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Anterior
                        </Button>

                        <div className="text-slate-400 font-semibold min-w-[100px] text-center">
                            {currentIndex + 1} de {permutations.length}
                        </div>

                        <Button
                            onClick={goToNext}
                            variant="outline"
                            size="lg"
                            className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-purple-500 text-slate-200 transition-all duration-200"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            <span className="font-semibold text-purple-400">
                                Nota:
                            </span>{' '}
                            Estas cinco operaciones se ejecutan en secuencia (θ
                            → ρ → π → χ → ι) formando una ronda completa.
                            Keccak-f[1600] aplica 24 rondas para lograr la
                            difusión y confusión necesarias para la seguridad
                            criptográfica.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
