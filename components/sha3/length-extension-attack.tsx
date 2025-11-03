'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function LengthExtensionAttack() {
    const [secretMessage, setSecretMessage] = useState('clave_secreta');
    const [publicMessage, setPublicMessage] = useState('mensaje_publico');
    const [attackData, setAttackData] = useState('datos_maliciosos');
    const [results, setResults] = useState<{
        sha2Original: string;
        sha2Extended: string;
        sha3Original: string;
        sha3Extended: string;
        sha2Vulnerable: boolean;
    } | null>(null);

    async function demonstrateAttack() {
        try {
            const [{ sha256 }, { sha3_256 }] = await Promise.all([
                import('js-sha256'),
                import('js-sha3'),
            ]);

            const originalMessage = secretMessage + publicMessage;
            const extendedMessage = originalMessage + attackData;

            // SHA-2 hashes
            const sha2Original = sha256(originalMessage);
            const sha2Extended = sha256(extendedMessage);

            // SHA-3 hashes
            const sha3Original = sha3_256(originalMessage);
            const sha3Extended = sha3_256(extendedMessage);

            // In a real length extension attack, the attacker could compute sha2Extended
            // without knowing secretMessage. This is a simplified demonstration.
            const sha2Vulnerable = true;

            setResults({
                sha2Original,
                sha2Extended,
                sha3Original,
                sha3Extended,
                sha2Vulnerable,
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error durante la demostración.');
        }
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-lg">
                    7
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">
                        Resistencia al Length Extension Attack
                    </h2>
                    <p className="text-slate-400 mt-1">
                        SHA-3 es inmune a este tipo de ataque por diseño
                    </p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <CardHeader>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                        SHA-2 es vulnerable al{' '}
                        <strong>ataque de extensión de longitud</strong>: un
                        atacante que conoce <code>H(mensaje)</code> puede
                        calcular{' '}
                        <code>H(mensaje || padding || datos_extra)</code> sin
                        conocer el mensaje original. SHA-3, gracias a su
                        construcción <strong>sponge</strong>, es naturalmente
                        resistente a este ataque.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card className="bg-blue-950/30 border-blue-800/50">
                        <CardHeader>
                            <CardTitle className="text-blue-300">
                                ¿Cómo funciona el ataque?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal list-inside text-slate-300 space-y-2 text-sm">
                                <li>
                                    El atacante conoce el hash{' '}
                                    <code>H(mensaje_secreto)</code> pero no el
                                    mensaje
                                </li>
                                <li>
                                    En SHA-2, el hash es el estado interno
                                    después de procesar el mensaje
                                </li>
                                <li>
                                    El atacante puede "continuar" el hasheo
                                    añadiendo datos extras
                                </li>
                                <li>
                                    Esto compromete esquemas como{' '}
                                    <code>H(clave_secreta || mensaje)</code>
                                </li>
                            </ol>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-300 mb-2 font-semibold">
                                Mensaje Secreto (simulado):
                            </label>
                            <Input
                                value={secretMessage}
                                onChange={(e) =>
                                    setSecretMessage(e.target.value)
                                }
                                className="bg-slate-800 border-slate-600 text-slate-200"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-2 font-semibold">
                                Mensaje Público:
                            </label>
                            <Input
                                value={publicMessage}
                                onChange={(e) =>
                                    setPublicMessage(e.target.value)
                                }
                                className="bg-slate-800 border-slate-600 text-slate-200"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-2 font-semibold">
                                Datos que el Atacante Quiere Añadir:
                            </label>
                            <Input
                                value={attackData}
                                onChange={(e) => setAttackData(e.target.value)}
                                className="bg-slate-800 border-slate-600 text-slate-200"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={demonstrateAttack}
                        className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3 shadow-lg"
                    >
                        Demostrar Ataque
                    </Button>

                    {results && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-white">
                                Resultados de la Demostración
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-slate-950 border-red-500 border-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-red-400">
                                            SHA-256 (Vulnerable)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1 font-medium">
                                                Hash Original:
                                            </p>
                                            <code className="text-xs text-slate-200 break-all block p-2 bg-slate-900/50 rounded">
                                                {results.sha2Original}
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1 font-medium">
                                                Hash Extendido:
                                            </p>
                                            <code className="text-xs text-slate-200 break-all block p-2 bg-slate-900/50 rounded">
                                                {results.sha2Extended}
                                            </code>
                                        </div>
                                        <Card className="bg-red-950/30 border-red-800/50">
                                            <CardContent className="pt-4">
                                                <p className="text-sm text-red-300">
                                                    ⚠️ Un atacante podría
                                                    calcular el hash extendido
                                                    sin conocer el mensaje
                                                    secreto.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-950 border-green-500 border-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-green-400">
                                            SHA3-256 (Resistente)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1 font-medium">
                                                Hash Original:
                                            </p>
                                            <code className="text-xs text-slate-200 break-all block p-2 bg-slate-900/50 rounded">
                                                {results.sha3Original}
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1 font-medium">
                                                Hash Extendido:
                                            </p>
                                            <code className="text-xs text-slate-200 break-all block p-2 bg-slate-900/50 rounded">
                                                {results.sha3Extended}
                                            </code>
                                        </div>
                                        <Card className="bg-green-950/30 border-green-800/50">
                                            <CardContent className="pt-4">
                                                <p className="text-sm text-green-300">
                                                    ✓ La construcción Sponge
                                                    hace imposible este ataque.
                                                    El atacante necesitaría
                                                    conocer el mensaje completo.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-gradient-to-r from-slate-950 to-slate-900 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-xl text-yellow-400">
                                        Explicación Técnica
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        En SHA-2, el hash final es simplemente
                                        el estado interno después de procesar el
                                        mensaje. Un atacante que conoce este
                                        estado puede "continuar" el proceso de
                                        hashing añadiendo más datos. En SHA-3,
                                        la parte{' '}
                                        <strong className="text-green-400">
                                            capacity
                                        </strong>{' '}
                                        del estado nunca se expone, por lo que
                                        es imposible continuar el proceso sin
                                        conocer el mensaje completo.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-950/30 border-green-800/50">
                                <CardContent className="pt-6">
                                    <p className="text-green-200 text-sm leading-relaxed">
                                        <strong>Conclusión:</strong> Esta es una
                                        de las principales ventajas de SHA-3
                                        sobre SHA-2. Aunque SHA-2 puede
                                        mitigarse usando HMAC, SHA-3 es
                                        resistente por diseño.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
