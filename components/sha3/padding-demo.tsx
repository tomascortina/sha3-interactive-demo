'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function PaddingDemo() {
    const [input, setInput] = useState('Hola');
    const [results, setResults] = useState<{
        messageBits: number;
        messageBytes: number;
        paddingBits: number;
        paddingBytes: number;
        zerosCount: number;
        totalBits: number;
        blocks: number;
    } | null>(null);

    const RATE = 1152; // SHA3-224 rate in bits

    function calculatePadding() {
        const messageBytes = new TextEncoder().encode(input).length;
        const messageBits = messageBytes * 8;

        // Calculate padding needed
        const remainder = messageBits % RATE;
        const paddingBits = remainder === 0 ? RATE : RATE - remainder;
        const paddingBytes = Math.ceil(paddingBits / 8);

        // pad10*1: 1 + zeros + 1
        const zerosCount = paddingBits - 2;

        const totalBits = messageBits + paddingBits;
        const blocks = totalBits / RATE;

        setResults({
            messageBits,
            messageBytes,
            paddingBits,
            paddingBytes,
            zerosCount,
            totalBits,
            blocks,
        });
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                    2
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Padding en SHA-3: Preparando el Mensaje
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Comprende cómo se completan los bloques con el esquema
                        pad10*1
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <p className="text-slate-300 leading-relaxed">
                        El mensaje se divide en bloques del tamaño adecuado para
                        el algoritmo. Si el mensaje no es múltiplo del tamaño de
                        bloque, se le agrega{' '}
                        <strong className="text-yellow-400">
                            padding (relleno)
                        </strong>{' '}
                        para completar. SHA-3 usa el esquema{' '}
                        <code className="text-yellow-300 bg-slate-800 px-2 py-1 rounded">
                            pad10*1
                        </code>
                        : un <code className="text-green-400">1</code>, luego
                        los <code className="text-gray-400">0</code> necesarios,
                        y se cierra con <code className="text-red-400">1</code>.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Interactive Demo */}
                    <Card className="bg-slate-800/50 border-blue-500/30">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-400">
                                🎮 Demostración Interactiva
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-slate-300 mb-2 font-semibold">
                                    Escribe tu mensaje:
                                </label>
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={3}
                                    className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ejemplo: Hola"
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    El padding se calculará automáticamente para
                                    SHA3-224 (rate = 1152 bits)
                                </p>
                            </div>

                            <Button
                                onClick={calculatePadding}
                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all"
                            >
                                🔢 Calcular Padding
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    {results && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Message Analysis */}
                            <Card className="bg-slate-900/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">
                                        📊 Análisis del Mensaje
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/30">
                                            <p className="text-slate-400 text-sm mb-1">
                                                Tamaño del Mensaje
                                            </p>
                                            <p className="text-2xl font-bold text-purple-400">
                                                {results.messageBits} bits
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {results.messageBytes} bytes
                                            </p>
                                        </div>
                                        <div className="bg-slate-800 rounded-lg p-4 border border-blue-500/30">
                                            <p className="text-slate-400 text-sm mb-1">
                                                Rate (SHA3-224)
                                            </p>
                                            <p className="text-2xl font-bold text-blue-400">
                                                1152 bits
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                144 bytes
                                            </p>
                                        </div>
                                        <div className="bg-slate-800 rounded-lg p-4 border border-green-500/30">
                                            <p className="text-slate-400 text-sm mb-1">
                                                Padding Necesario
                                            </p>
                                            <p className="text-2xl font-bold text-green-400">
                                                {results.paddingBits} bits
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {results.paddingBytes} bytes
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Block Visualization */}
                            <Card className="bg-slate-900/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">
                                        🧩 Visualización de Bloques
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Array.from({
                                            length: results.blocks,
                                        }).map((_, blockIndex) => (
                                            <div
                                                key={blockIndex}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-slate-400 text-sm w-20">
                                                    Bloque {blockIndex + 1}:
                                                </span>
                                                <div className="flex-1 h-8 flex rounded overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                                                        style={{
                                                            width: `${
                                                                (Math.min(
                                                                    results.messageBits -
                                                                        blockIndex *
                                                                            RATE,
                                                                    RATE
                                                                ) /
                                                                    RATE) *
                                                                100
                                                            }%`,
                                                        }}
                                                    >
                                                        {blockIndex === 0 &&
                                                            'Mensaje'}
                                                    </div>
                                                    {blockIndex ===
                                                        results.blocks - 1 && (
                                                        <div
                                                            className="bg-yellow-500 flex items-center justify-center text-xs text-white font-semibold"
                                                            style={{
                                                                width: `${
                                                                    (results.paddingBits /
                                                                        RATE) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        >
                                                            Padding
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                            <span className="text-slate-400">
                                                Mensaje original
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                            <span className="text-slate-400">
                                                Padding pad10*1
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Padding Detail */}
                            <Card className="bg-slate-900/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">
                                        🔍 Detalle del Padding pad10*1
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-800 rounded-lg p-4 mb-4">
                                        <h4 className="text-lg font-semibold text-yellow-400 mb-3">
                                            Estructura del Padding:
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                                    1
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">
                                                        Primer bit:{' '}
                                                        <code className="text-green-400">
                                                            1
                                                        </code>
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        Marca el inicio del
                                                        padding
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                                    0*
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">
                                                        Bits intermedios:{' '}
                                                        <code className="text-gray-400">
                                                            0
                                                        </code>{' '}
                                                        repetidos
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        Se agregan{' '}
                                                        <span className="text-yellow-400 font-semibold">
                                                            {results.zerosCount}
                                                        </span>{' '}
                                                        ceros
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                                    1
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">
                                                        Último bit:{' '}
                                                        <code className="text-red-400">
                                                            1
                                                        </code>
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        Cierra el padding y
                                                        completa el bloque
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Representation */}
                                    <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
                                        <h4 className="text-lg font-semibold text-blue-400 mb-3">
                                            Representación Visual:
                                        </h4>
                                        <div className="font-mono text-sm whitespace-nowrap">
                                            <span className="text-green-400">
                                                1
                                            </span>
                                            <span className="text-gray-400">
                                                {Array(
                                                    Math.min(
                                                        results.zerosCount,
                                                        50
                                                    )
                                                )
                                                    .fill('0')
                                                    .join('')}
                                            </span>
                                            {results.zerosCount > 50 && (
                                                <span className="text-gray-500">
                                                    ...(
                                                    {results.zerosCount -
                                                        50}{' '}
                                                    más)
                                                </span>
                                            )}
                                            <span className="text-red-400">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Step by Step */}
                            <Card className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">
                                        📝 Proceso Paso a Paso
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-slate-300">
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                                                1
                                            </span>
                                            <p>
                                                <strong>
                                                    Mensaje original:
                                                </strong>{' '}
                                                <span className="text-blue-300">
                                                    &quot;{input}&quot;
                                                </span>{' '}
                                                ={' '}
                                                <span className="text-yellow-300">
                                                    {results.messageBits} bits
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                                                2
                                            </span>
                                            <p>
                                                <strong>
                                                    Tamaño del bloque:
                                                </strong>{' '}
                                                Para SHA3-224, el rate es{' '}
                                                <span className="text-yellow-300">
                                                    1152 bits
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                                                3
                                            </span>
                                            <p>
                                                <strong>
                                                    Cálculo del padding:
                                                </strong>{' '}
                                                <span className="text-yellow-300">
                                                    {RATE} - (
                                                    {results.messageBits} %{' '}
                                                    {RATE}) ={' '}
                                                    {results.paddingBits} bits
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                                                4
                                            </span>
                                            <p>
                                                <strong>
                                                    Aplicar pad10*1:
                                                </strong>{' '}
                                                Se agrega{' '}
                                                <code className="text-green-400">
                                                    1
                                                </code>{' '}
                                                +{' '}
                                                <span className="text-yellow-300">
                                                    {results.zerosCount} ceros
                                                </span>{' '}
                                                +{' '}
                                                <code className="text-red-400">
                                                    1
                                                </code>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                                                ✓
                                            </span>
                                            <p>
                                                <strong>Resultado:</strong>{' '}
                                                Mensaje completo de{' '}
                                                <span className="text-green-300">
                                                    {results.totalBits} bits
                                                </span>
                                                , listo para procesar
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Info Note */}
                            <div className="p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded">
                                <p className="text-blue-300 text-sm">
                                    <strong>💡 Dato importante:</strong> El
                                    padding es necesario porque el algoritmo
                                    procesa datos en bloques de tamaño fijo. Sin
                                    padding, el último bloque podría quedar
                                    incompleto. El esquema{' '}
                                    <code className="bg-slate-800 px-2 py-1 rounded">
                                        pad10*1
                                    </code>{' '}
                                    de Keccak es único y diferente del padding
                                    de SHA-2, y asegura que siempre se agreguen
                                    al menos 2 bits (en el mejor caso, un bloque
                                    completo de padding).
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
