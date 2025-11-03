'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function AvalancheEffect() {
    const [inputType, setInputType] = useState<'text' | 'file'>('text');
    const [textInput, setTextInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{
        hash1: string;
        hash2: string;
        input1: string;
        input2: string;
        bitsChanged: number;
        percentage: number;
        bits1: string;
        bits2: string;
        changedByteIndex?: number;
        changedBitIndex?: number;
        modBefore?: string;
        modChar?: string;
        modAfter?: string;
        isText?: boolean;
    } | null>(null);

    async function processHash() {
        setLoading(true);

        try {
            let data: Uint8Array;
            let inputSnippet = '';

            if (inputType === 'text') {
                data = new TextEncoder().encode(textInput);
                inputSnippet =
                    textInput.length > 50
                        ? textInput.substring(0, 50) + '...'
                        : textInput;
            } else {
                if (!file) {
                    alert('Por favor, selecciona un archivo.');
                    return;
                }
                data = new Uint8Array(await file.arrayBuffer());
                inputSnippet = file.name;
            }

            // Import sha3 library dynamically
            const { sha3_256 } = await import('js-sha3');

            // Calcula hash original
            const hash1 = sha3_256(data);

            // Flip aleatorio de bit
            const {
                out: modifiedData,
                byteIndex,
                bitIndex,
            } = flipRandomBit(data);

            // Calcula hash modificado
            const hash2 = sha3_256(modifiedData);

            // A binario y conteo de diferencias
            const bits1 = hexToBinary(hash1);
            const bits2 = hexToBinary(hash2);
            let bitsChanged = 0;
            for (let i = 0; i < bits1.length; i++)
                if (bits1[i] !== bits2[i]) bitsChanged++;
            const percentage = ((bitsChanged / bits1.length) * 100).toFixed(2);

            // Si es texto, armamos el preview mostrando la letra NUEVA en verde
            let modBefore: string | undefined,
                modChar: string | undefined,
                modAfter: string | undefined;
            let isText = inputType === 'text';
            if (isText) {
                const prev = bytePreview(modifiedData, byteIndex); // usamos los BYTES MODIFICADOS
                modBefore = prev.before;
                modChar = prev.changed; // ESTA es la letra resultante tras el flip de bit
                modAfter = prev.after;
            }

            setResults({
                hash1,
                hash2,
                input1: inputSnippet,
                input2: inputSnippet + ' (1 bit modificado)',
                bitsChanged,
                percentage: Number.parseFloat(percentage),
                bits1,
                bits2,
                changedByteIndex: byteIndex,
                changedBitIndex: bitIndex,
                modBefore,
                modChar,
                modAfter,
                isText,
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar los hashes.');
        } finally {
            setLoading(false);
        }
    }
    function flipRandomBit(data: Uint8Array) {
        const totalBits = data.length * 8;
        const rand = Math.floor(Math.random() * totalBits);
        const byteIndex = Math.floor(rand / 8);
        const bitIndex = rand % 8;
        const mask = 1 << bitIndex;
        const out = new Uint8Array(data);
        out[byteIndex] ^= mask;
        return { out, byteIndex, bitIndex };
    }

    function bytePreview(
        bytes: Uint8Array,
        byteIndex: number,
        windowSize = 50
    ) {
        const chars = Array.from(bytes).map((b) => String.fromCharCode(b));
        const start = Math.max(0, byteIndex - Math.floor(windowSize / 2));
        const end = Math.min(chars.length, start + windowSize);
        return {
            before: chars.slice(start, byteIndex).join(''),
            changed: chars[byteIndex] ?? '',
            after: chars.slice(byteIndex + 1, end).join(''),
        };
    }

    function highlightChangedChar(original: string, modified: string) {
        if (!original || !modified) return modified;
        let highlighted = modified.split('').map((ch, i) => {
            if (i === 0) {
                return (
                    <span key={i} className="text-green-400 font-bold">
                        {ch}
                    </span>
                );
            }
            return <span key={i}>{ch}</span>;
        });
        return highlighted;
    }

    function hexToBinary(hex: string): string {
        return hex
            .split('')
            .map((char) =>
                Number.parseInt(char, 16).toString(2).padStart(4, '0')
            )
            .join('');
    }

    function renderColoredBits(bits1: string, bits2: string) {
        return bits1.split('').map((bit, i) => {
            const match = bit === bits2[i];
            return (
                <span
                    key={i}
                    className={match ? 'text-green-400' : 'text-red-400'}
                >
                    {bit}
                </span>
            );
        });
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xl shadow-lg">
                    8
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Efecto Avalancha
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Pequeños cambios producen resultados completamente
                        diferentes
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                        Un pequeño cambio en la entrada produce un cambio
                        drástico e impredecible en el hash.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs
                        value={inputType}
                        onValueChange={(v) =>
                            setInputType(v as 'text' | 'file')
                        }
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text">
                                Escribir Texto
                            </TabsTrigger>
                            <TabsTrigger value="file">
                                Subir Archivo
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="text" className="mt-4">
                            <Textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                rows={6}
                                placeholder="Escribe tu texto aquí..."
                                className="bg-slate-800 border-slate-600 text-slate-200"
                            />
                        </TabsContent>
                        <TabsContent value="file" className="mt-4">
                            <input
                                type="file"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200 cursor-pointer"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                El archivo se procesará localmente en tu
                                navegador.
                            </p>
                        </TabsContent>
                    </Tabs>

                    <div className="text-center">
                        <Button
                            onClick={processHash}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 shadow-lg"
                        >
                            {loading
                                ? 'Procesando...'
                                : 'Calcular y Comparar Hashes'}
                        </Button>
                    </div>

                    {results && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-white">
                                Resultados de la Comparación
                            </h3>

                            {/* Hashes */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-slate-950 border-green-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-green-400">
                                            Hash Original
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 break-words">
                                            {results.input1}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <code className="text-sm text-slate-200 break-all block font-mono">
                                            {results.hash1}
                                        </code>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-950 border-red-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-red-400">
                                            Hash Modificado
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 break-words">
                                            {results.isText &&
                                            results.modChar !== undefined ? (
                                                <>
                                                    {results.modBefore}
                                                    <span className="text-green-400 font-bold">
                                                        {results.modChar}
                                                    </span>
                                                    {results.modAfter}
                                                    <span className="ml-2 text-xs text-slate-500">
                                                        (byte{' '}
                                                        {
                                                            results.changedByteIndex
                                                        }
                                                        , bit{' '}
                                                        {
                                                            results.changedBitIndex
                                                        }
                                                        )
                                                    </span>
                                                </>
                                            ) : (
                                                results.input2
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <code className="text-sm text-slate-200 break-all block font-mono">
                                            {results.hash2}
                                        </code>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Statistics */}
                            <Card className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/40 shadow-lg shadow-blue-900/20">
                                <CardHeader>
                                    <CardTitle className="text-xl text-blue-400">
                                        Análisis de Avalancha
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl text-slate-200 font-bold">
                                        <span className="text-blue-400">
                                            {results.bitsChanged}
                                        </span>{' '}
                                        de 256 bits cambiaron (
                                        {results.percentage}%)
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        Un buen efecto avalancha debe cambiar
                                        aproximadamente el 50% de los bits.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Bit Comparison */}
                            <div>
                                <h4 className="text-xl font-semibold text-white mb-4">
                                    Comparación Visual Bit a Bit
                                </h4>
                                <p className="text-sm text-slate-400 mb-4">
                                    <span className="text-green-400 font-bold">
                                        Verde
                                    </span>{' '}
                                    = bits idénticos.{' '}
                                    <span className="text-red-400 font-bold">
                                        Rojo
                                    </span>{' '}
                                    = bits diferentes.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-slate-950 border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-green-400">
                                                Bits del Hash Original
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <code className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">
                                                {renderColoredBits(
                                                    results.bits1,
                                                    results.bits2
                                                )}
                                            </code>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-slate-950 border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-red-400">
                                                Bits del Hash Modificado
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <code className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">
                                                {renderColoredBits(
                                                    results.bits2,
                                                    results.bits1
                                                )}
                                            </code>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
