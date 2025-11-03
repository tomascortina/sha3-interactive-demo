import { IntroSection } from '@/components/sha3/intro-section';
import { SpongeAnimated } from '@/components/sha3/sponge-animated';
import { SpongePhases } from '@/components/sha3/sponge-phases';
import { PaddingDemo } from '@/components/sha3/padding-demo';
import { InfoWithGif } from '@/components/sha3/info-with-gif';
import { KeccakPermutations } from '@/components/sha3/keccak-permutations';
import { SpeedComparison } from '@/components/sha3/speed-comparison';
import { LengthExtensionAttack } from '@/components/sha3/length-extension-attack';
import { AvalancheEffect } from '@/components/sha3/avalanche-effect';
import { Separator } from '@/components/ui/separator';

export default function SHA3Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 scroll-smooth">
            <header className="top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            SHA-3: Análisis Comparativo Completo
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Demostraciones interactivas de fortalezas y
                            debilidades del algoritmo criptográfico SHA-3
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
                {/* Section 1: Introduction */}
                <div
                    id="section-1"
                    className="pt-8 scroll-mt-28 md:scroll-mt-40"
                >
                    <IntroSection />

                    {/* Table of Contents */}
                    <nav className="mt-8">
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-slate-200 mb-4">
                                Contenido
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                    {
                                        num: '1',
                                        title: 'Visualización Animada',
                                        icon: '🎨',
                                    },
                                    {
                                        num: '2',
                                        title: 'Padding en SHA-3',
                                        icon: '📦',
                                    },
                                    {
                                        num: '3',
                                        title: 'Función f',
                                        icon: '🔄',
                                    },
                                    {
                                        num: '4',
                                        title: 'Permutaciones Keccak-f',
                                        icon: '🔀',
                                    },
                                    {
                                        num: '5',
                                        title: 'Eficiencia de Keccak-f',
                                        icon: '⚡',
                                    },
                                    {
                                        num: '6',
                                        title: 'Comparación de Velocidad',
                                        icon: '🏃',
                                    },
                                    {
                                        num: '7',
                                        title: 'Resistencia a Ataques',
                                        icon: '🛡️',
                                    },
                                    {
                                        num: '8',
                                        title: 'Efecto Avalancha',
                                        icon: '💥',
                                    },
                                ].map((item) => (
                                    <a
                                        key={item.num}
                                        href={`#section-${
                                            Number.parseInt(item.num) + 1
                                        }`}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700 hover:border-slate-600 group"
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <div>
                                            <span className="text-sm font-semibold text-slate-400">
                                                Sección {item.num}
                                            </span>
                                            <p className="text-sm text-slate-300">
                                                {item.title}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 2: Animated Sponge Visualization */}
                <div id="section-2" className="scroll-mt-28 md:scroll-mt-40">
                    <SpongeAnimated />
                    <SpongePhases />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 3: Padding Demo */}
                <div id="section-3" className="scroll-mt-28 md:scroll-mt-40">
                    <PaddingDemo />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 4: How function f works */}
                <div id="section-4" className="scroll-mt-28 md:scroll-mt-40">
                    <InfoWithGif
                        sectionNumber={3}
                        title="Cómo funciona la función f"
                        gifUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GIFCUBE-Nxf92z8nVwXLhKqYoUMGHZ85DwfBZl.gif"
                        gifAlt="Función f de Keccak"
                        content={
                            <>
                                <p className="text-lg leading-relaxed">
                                    La función f es donde ocurre toda la mezcla
                                    interna del algoritmo.
                                </p>
                                <p className="leading-relaxed">
                                    Podemos pensar el estado de f como un{' '}
                                    <strong className="text-cyan-400">
                                        volumen tridimensional de datos
                                    </strong>
                                    , formado por 1.600 bits organizados en una
                                    matriz de 5×5×64.
                                </p>
                                <p className="leading-relaxed">
                                    Cada posición en ese volumen representa una
                                    parte del estado, y sobre este espacio
                                    tridimensional se aplican las operaciones de
                                    mezcla —las cinco transformaciones:{' '}
                                    <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded">
                                        θ
                                    </code>
                                    ,
                                    <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded mx-1">
                                        ρ
                                    </code>
                                    ,
                                    <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded">
                                        π
                                    </code>
                                    ,
                                    <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded mx-1">
                                        χ
                                    </code>{' '}
                                    e
                                    <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded mx-1">
                                        ι
                                    </code>
                                    — que actúan sobre filas, columnas y planos
                                    del cubo para lograr una difusión completa
                                    de los bits a lo largo de todo el estado.
                                </p>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30 mt-4">
                                    <h3 className="font-semibold text-cyan-400 mb-2">
                                        Estructura 3D del Estado:
                                    </h3>
                                    <ul className="space-y-1 text-sm">
                                        <li>
                                            • <strong>5×5×64</strong> = 1600
                                            bits totales
                                        </li>
                                        <li>
                                            • <strong>25 lanes</strong> de 64
                                            bits cada uno
                                        </li>
                                        <li>
                                            • <strong>24 rondas</strong> de
                                            transformación
                                        </li>
                                    </ul>
                                </div>
                            </>
                        }
                    />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 5: Keccak-f Permutations */}
                <div id="section-5" className="scroll-mt-28 md:scroll-mt-40">
                    <KeccakPermutations />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 6: Keccak-f Efficiency */}
                <div id="section-6" className="scroll-mt-28 md:scroll-mt-40">
                    <InfoWithGif
                        sectionNumber={5}
                        title="Eficiencia de Keccak-f"
                        gifUrl="/RepresentacionEnMemoriaGIF.gif"
                        gifAlt="Eficiencia de Keccak-f"
                        content={
                            <>
                                <p className="leading-relaxed">
                                    Aunque se puede pensar en el rate y capacity
                                    como un &quot;volumen&quot; 5×5×64, en la
                                    práctica no se guarda como un cubo de bits.
                                    Se representa como{' '}
                                    <strong className="text-green-400">
                                        25 palabras de 64 bits
                                    </strong>{' '}
                                    (un arreglo 5×5 de &quot;lanes&quot;, cada
                                    lane es un int64): en total 25×64 = 1600
                                    bits del estado de Keccak-f.
                                </p>
                                <p className="leading-relaxed">
                                    Esta representación hace que las operaciones
                                    de cada ronda sean muy eficientes porque se
                                    aplican a nivel de palabra:
                                </p>
                                <div className="space-y-3 mt-4">
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-500/30">
                                        <p className="text-sm">
                                            <strong className="text-blue-400">
                                                θ (theta):
                                            </strong>{' '}
                                            los XOR de &quot;columnas&quot; se
                                            calculan como XOR de cinco palabras
                                            de 64 bits cada una (una por lane de
                                            la columna). Eso da el
                                            &quot;parity&quot; de columna en una
                                            sola operación por palabra, sin
                                            extraer bits individuales.
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
                                        <p className="text-sm">
                                            <strong className="text-purple-400">
                                                ρ (rho):
                                            </strong>{' '}
                                            es solo un rotate de 64 bits por
                                            lane (las CPUs tienen rotaciones de
                                            palabra muy rápidas).
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-pink-500/30">
                                        <p className="text-sm">
                                            <strong className="text-pink-400">
                                                π (pi):
                                            </strong>{' '}
                                            es reindexar/mover referencias: cada
                                            palabra pasa a otra posición
                                            (permuta las 25 palabras).
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-yellow-500/30">
                                        <p className="text-sm">
                                            <strong className="text-yellow-400">
                                                χ (chi):
                                            </strong>{' '}
                                            se implementa con operaciones
                                            binarias entre palabras: A[i] ^=
                                            (~A[i+1]) & A[i+2] (índices módulo 5
                                            dentro de la fila), todo en 64 bits
                                            de ancho.
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-green-500/30">
                                        <p className="text-sm">
                                            <strong className="text-green-400">
                                                ι (iota):
                                            </strong>{' '}
                                            un XOR de la constante de ronda
                                            directamente sobre una de las
                                            palabras.
                                        </p>
                                    </div>
                                </div>
                                <p className="leading-relaxed mt-4">
                                    Como los índices se toman módulo 5, para
                                    &quot;vecinos&quot; basta referenciar otra
                                    palabra del arreglo (no hay que manipular
                                    bits sueltos).
                                </p>
                                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/30 mt-4">
                                    <p className="text-sm">
                                        <strong className="text-green-400">
                                            Conclusión:
                                        </strong>{' '}
                                        al modelar el estado como 25 uint64, se
                                        evitan operaciones lentas de
                                        &quot;enmascarar y desplazar&quot; bits.
                                        Casi todo se reduce a XORs, ANDs y
                                        rotaciones entre 25 variables, lo que
                                        hace a Keccak muy amigable al hardware y
                                        también eficiente en software.
                                    </p>
                                </div>
                            </>
                        }
                    />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 7: Speed Comparison */}
                <div id="section-7" className="scroll-mt-28 md:scroll-mt-40">
                    <SpeedComparison />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 8: Length Extension Attack */}
                <div id="section-8" className="scroll-mt-28 md:scroll-mt-40">
                    <LengthExtensionAttack />
                </div>

                <Separator className="bg-slate-800" />

                {/* Section 9: Avalanche Effect */}
                <div id="section-9" className="scroll-mt-28 md:scroll-mt-40">
                    <AvalancheEffect />
                </div>
            </main>

            <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
                    <p className="text-sm">
                        SHA-3 (Secure Hash Algorithm 3) fue estandarizado por
                        NIST en 2015 como alternativa a SHA-2
                    </p>
                </div>
            </footer>
        </div>
    );
}
